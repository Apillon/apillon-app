export default function useSmartContractsStore() {
  const formRef = ref<NFormInst | null>(null);
  const settings = ref([false, false, false, false]);
  const form = ref<{ [key: string]: any }>({
    name: '',
    description: '',
    chain: null,
  });

  // Define the Astar Shibuya chain configuration
  const astarShibuya = ref({
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
  });

  const isSpecialField = (input: any) => input.name === '_dropStart';

  function addSettingsOption(e) {
    e.preventDefault();
    settings.value.push(false);
    console.log(settings);
  }

  function disablePastDate(ts: number) {
    return ts < new Date().setHours(0, 0, 0, 0);
  }

  function disablePastTime(ts: number) {
    return ts < Date.now();
  }

  return {
    formRef,
    form,
    settings,
    addSettingsOption,
    disablePastDate,
    disablePastTime,
    isSpecialField,
    astarShibuya,
  };
}
