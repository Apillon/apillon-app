import { v4 as uuidv4 } from 'uuid';
import IconInfo from '~/components/parts/Icon/Info.vue';

export default function useComputing() {
  const { t, te } = useI18n();
  const message = useMessage();
  const router = useRouter();
  const contractStore = useContractStore();
  const transactionStore = useComputingTransactionStore();
  const { updateFileStatus } = useUpload();
  const { deployments, calcProgress, clearIntervalFile, checkUnfinishedContracts } =
    useRefreshStatus();

  let transactionInterval: any = null as any;

  onUnmounted(() => {
    clearInterval(transactionInterval);
  });

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
        { page: transactionStore.pagination.page },
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
    checkUnfinishedContracts();
    if (contract.contractStatus === ContractStatus.DEPLOYED) {
      router.push(`/dashboard/service/computing/${contract.contract_uuid}`);
    } else {
      router.push({ name: 'dashboard-service-computing' });
    }
  }

  async function uploadFileToIPFS(
    file: FileListItemType,
    bucketUuid: string,
    encryptedContent?: string
  ): Promise<FileInterface | null> {
    const sessionUuid = uuidv4();
    const data = {
      session_uuid: sessionUuid,
      files: [{ fileName: file.name }],
    };
    updateFileStatus(file, FileUploadStatusValue.UPLOADING);

    deployments.value.file.interval = setInterval(() => {}, 100000);
    deployments.value.file.progress = 0;
    deployments.value.file.service = file;

    const progressInterval = setInterval(() => {
      deployments.value.file.progress = calcProgress(deployments.value.file.progress, 0.1);
    }, 100);

    try {
      const uploadSession = await $api.post<FilesUploadRequestResponse>(
        endpoints.storageFilesUpload(bucketUuid),
        data
      );
      const uploadUrl = uploadSession.data.files[0];
      // Upload to S3
      await fetch(uploadUrl.url, {
        method: 'PUT',
        body: encryptedContent || file.file,
      });

      // End session
      await $api.post(endpoints.storageFileUpload(bucketUuid, sessionUuid));

      if (encryptedContent) {
        setTimeout(() => {
          message.success(t('computing.contract.encrypt.step2Info'), { duration: 5000 });
        }, 1000);
      }

      // Start pooling file
      const filePoll = await getFile(bucketUuid, uploadUrl.file_uuid);

      file?.onFinish();
      deployments.value.file.progress = 100;
      updateFileStatus(file, FileUploadStatusValue.FINISHED);
      clearInterval(progressInterval);

      await sleep(500);
      clearIntervalFile();

      return filePoll;
    } catch (error) {
      file.onError();
      updateFileStatus(file, FileUploadStatusValue.ERROR);
      message.error(userFriendlyMsg(error));
    }
    return null;
  }

  async function getFile(bucketUuid: string, fileUuid: string): Promise<FileInterface> {
    if (deployments.value.file.interval) {
      clearInterval(deployments.value.file.interval);
    }
    return new Promise(function (resolve) {
      deployments.value.file.interval = setInterval(async () => {
        const fileData = await getFilePoll(bucketUuid, fileUuid);

        if (fileData && deployments.value.file.interval && (fileData?.CID || fileData?.CIDv1)) {
          clearInterval(deployments.value.file.interval);
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

  function labelInfo(field: string, base = 'form.label.contract') {
    if (
      te(`${base}.${field}`) &&
      te(`${base}.labelInfo.${field}`) &&
      t(`${base}.labelInfo.${field}`)
    ) {
      return [
        h('span', { class: 'mr-1' }, t(`${base}.${field}`)),
        h(
          IconInfo,
          { class: 'info-icon', size: 'sm', tooltip: t(`${base}.labelInfo.${field}`) },
          ''
        ),
      ];
    }
    return te(`${base}.${field}`) ? t(`${base}.${field}`) : field;
  }

  return {
    checkUnfinishedTransactions,
    labelInfo,
    onContractCreated,
    uploadFileToIPFS,
  };
}
