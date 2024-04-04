import { v4 as uuidv4 } from 'uuid';

export default function useCaptcha() {
  const { t } = useI18n();
  const message = useMessage();
  const router = useRouter();
  const contractStore = useContractStore();
  const transactionStore = useComputingTransactionStore();

  let contractInterval: any = null as any;
  let transactionInterval: any = null as any;

  onUnmounted(() => {
    clearInterval(contractInterval);
    clearInterval(transactionInterval);
  });

  /** Contract polling */
  function checkUnfinishedContracts() {
    clearInterval(contractInterval);

    const unfinishedCollection = contractStore.items.find(
      contract =>
        contract.contractStatus === ContractStatus.DEPLOY_INITIATED ||
        contract.contractStatus === ContractStatus.DEPLOYING
    );
    if (unfinishedCollection === undefined) {
      return;
    }

    contractInterval = setInterval(async () => {
      const contracts = await contractStore.fetchContracts(false);
      const contract = contracts.find(
        contract => contract.contract_uuid === unfinishedCollection.contract_uuid
      );
      if (!contract || contract.contractStatus >= CollectionStatus.DEPLOYED) {
        clearInterval(contractInterval);
      }
    }, 10000);
  }

  /** Transactions polling */
  function checkUnfinishedTransactions() {
    clearInterval(transactionInterval);

    const unfinishedTransaction = transactionStore.items.find(
      transaction => transaction.transactionStatus <= ComputingTransactionStatus.CONFIRMED
    );
    if (unfinishedTransaction === undefined) {
      clearInterval(transactionInterval);
      return;
    }
    const contractUuid = contractStore.active.contract_uuid;

    transactionInterval = setInterval(async () => {
      const transactions = await transactionStore.fetchTransactions(
        contractUuid,
        transactionStore.pagination.page,
        false
      );
      const transaction = transactions.find(
        transaction => transaction.id === unfinishedTransaction.id
      );
      if (!transaction || transaction.transactionStatus > ComputingTransactionStatus.CONFIRMED) {
        clearInterval(transactionInterval);
        contractStore.active = await contractStore.fetchContract(contractUuid);
      }
    }, 10000);
  }

  function onContractCreated(contract: ContractInterface) {
    router.push(`/dashboard/service/computing/${contract.contract_uuid}`);
  }

  async function uploadFileToIPFS(
    file: FileListItemType,
    bucketUuid: string,
    encryptedContent: string
  ): Promise<FileInterface | null> {
    const sessionUuid = uuidv4();
    const data = {
      session_uuid: sessionUuid,
      files: [{ fileName: file.name }],
    };

    try {
      const uploadSession = await $api.post<FilesUploadRequestResponse>(
        endpoints.storageFilesUpload(bucketUuid),
        data
      );
      const uploadUrl = uploadSession.data.files[0];
      // Upload to S3
      await fetch(uploadUrl.url, {
        method: 'PUT',
        body: encryptedContent,
      });

      // End session
      await $api.post(endpoints.storageFileUpload(bucketUuid, sessionUuid));

      setTimeout(() => {
        message.success(t('computing.contract.encrypt.step2Info'), { duration: 5000 });
      }, 1000);

      // Start pooling file
      return await getFile(bucketUuid, uploadUrl.file_uuid);
    } catch (error) {
      message.error(userFriendlyMsg(error));
    }
    return null;
  }

  async function getFile(bucketUuid: string, fileUuid: string): Promise<FileInterface> {
    return new Promise(function (resolve) {
      const getFileInterval = setInterval(async () => {
        const fileData = await getFilePoll(bucketUuid, fileUuid);

        if (fileData && (fileData?.CID || fileData?.CIDv1)) {
          clearInterval(getFileInterval);
          resolve(fileData);
        }
      }, 5000);
    });
  }

  async function getFilePoll(bucketUuid: string, fileUuid: string): Promise<FileInterface> {
    const response = await $api.get<FileDetailsResponse>(
      endpoints.storageFileDetails(bucketUuid, fileUuid)
    );
    return response.data;
  }

  return {
    checkUnfinishedContracts,
    checkUnfinishedTransactions,
    onContractCreated,
    uploadFileToIPFS,
  };
}
