import { moonbaseAlpha, moonbeam, astar } from 'viem/chains';

// Define the Astar Shibuya chain configuration
const astarShibuya = {
  id: 81, // Chain ID for Astar Shibuya testnet
  name: 'Astar Shibuya',
  network: 'shibuya',
  nativeCurrency: {
    decimals: 18,
    name: 'SBY',
    symbol: 'SBY',
  },
  rpcUrls: {
    default: { http: ['https://rpc.shibuya.astar.network'] },
    public: { http: ['https://rpc.shibuya.astar.network'] },
  },
  blockExplorers: {
    default: { name: 'Subscan', url: 'https://shibuya.subscan.io/' },
  },
  testnet: true,
};

export default function useSmartContracts() {
  const router = useRouter();
  const { params } = useRoute();
  const dataStore = useDataStore();
  const smartContractStore = useSmartContractStore();
  const deployedContractStore = useDeployedContractStore();

  const pageLoading = ref<boolean>(true);
  let smartContractInterval: any = null as any;

  const isSpecialField = (input: any) => input.name === '_dropStart';

  function getChainConfig(chainId: number) {
    switch (chainId) {
      case moonbaseAlpha.id:
        return moonbaseAlpha;
      case moonbeam.id:
        return moonbeam;
      case astar.id:
        return astar;
      case astarShibuya.id:
        return astarShibuya;
    }
  }

  async function init() {
    const contractUuid = params?.id ? params?.id : params?.slug;
    if (!contractUuid) {
      router.push({ name: 'dashboard-service-smart-contracts' });
    }

    await Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const smartContract = await smartContractStore.getSmartContract(`${contractUuid}`);

      if (!smartContract) {
        router.push({ name: 'dashboard-service-smart-contracts' });
      } else {
        smartContractStore.active = smartContract;
        pageLoading.value = false;
      }
    });
  }

  /** Contract polling */
  function checkUnfinishedSmartContracts() {
    clearInterval(smartContractInterval);

    const unfinishedContract = deployedContractStore.items.find(
      contract =>
        contract.contractStatus === SmartContractStatus.DEPLOY_INITIATED ||
        contract.contractStatus === SmartContractStatus.DEPLOYING
    );
    console.log(unfinishedContract);
    if (unfinishedContract === undefined) return;

    smartContractInterval = setInterval(async () => {
      const smartContracts = await deployedContractStore.fetchDeployedContracts(
        deployedContractStore.pagination.page,
        deployedContractStore.pagination.pageSize,
        false
      );
      const smartContract = smartContracts.find(
        contract => contract.contract_uuid === unfinishedContract.contract_uuid
      );
      if (!smartContract || smartContract.contractStatus >= SmartContractStatus.DEPLOYED) {
        clearInterval(smartContractInterval);
      }
    }, 10000);
  }

  return {
    astarShibuya,
    pageLoading,
    checkUnfinishedSmartContracts,
    getChainConfig,
    init,
    isSpecialField,
  };
}
