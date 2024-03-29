import IconInfo from '~/components/parts/Icon/Info.vue';

export default function useCaptcha() {
  const { t, te } = useI18n();
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

  function labelInfo(field: string) {
    if (
      te(`form.label.contract.${field}`) &&
      te(`form.label.contract.labelInfo.${field}`) &&
      t(`form.label.contract.labelInfo.${field}`)
    ) {
      return [
        h('span', { class: 'mr-1' }, t(`form.label.contract.${field}`)),
        h(IconInfo, { size: 'sm', tooltip: t(`form.label.contract.labelInfo.${field}`) }, ''),
      ];
    }
    return te(`form.label.contract.${field}`) ? t(`form.label.contract.${field}`) : field;
  }

  return {
    checkUnfinishedContracts,
    checkUnfinishedTransactions,
    labelInfo,
    onContractCreated,
  };
}
