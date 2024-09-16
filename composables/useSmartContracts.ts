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

  const pageLoading = ref<boolean>(true);
  const formRef = ref<NFormInst | null>(null);
  const settings = ref([false, false, false, false]);
  const form = ref<{ [key: string]: any }>({
    name: '',
    description: '',
    chain: null,
  });

  const isSpecialField = (input: any) => input.name === '_dropStart';

  function addSettingsOption(e) {
    e.preventDefault();
    settings.value.push(false);
    console.log(settings);
  }

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

  return {
    astarShibuya,
    formRef,
    form,
    pageLoading,
    settings,
    addSettingsOption,
    getChainConfig,
    init,
    isSpecialField,
  };
}
