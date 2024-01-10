export default function useCaptcha() {
  const router = useRouter();
  const contractStore = useContractStore();

  let contractInterval: any = null as any;

  /** Contract polling */
  function checkUnfinishedContract() {
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
    }, 30000);
  }

  function onContractCreated(contract: ContractInterface) {
    router.push(`/dashboard/service/computing/${contract.contract_uuid}`);
  }

  return {
    checkUnfinishedContract,
    onContractCreated,
  };
}
