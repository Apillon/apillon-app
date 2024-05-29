import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Contract {
  createTime: string;
  updateTime: string;
  contract_uuid: string;
  project_uuid: string;
  bucket_uuid: string;
  name: string;
  description: string;
  contractType: number;
  contractStatus: number;
  contractAbi_id: number;
  contractAddress: string | null;
  deployerAddress: string;
}

const dropdownOptions = ref([
  { label: '10s', key: 0, value: 10 },
  { label: '20s', key: 1, value: 20 },
  { label: '30s', key: 2, value: 30 },
  { label: '40s', key: 3, value: 40 },
]);

export default function useRefreshStatus() {
  // stores
  const contractStore = useContractStore();
  // UI
  const activeInfoWindow = ref(false);

  const activeServices = ref<Contract[]>([]);

  const refreshInterval = ref(dropdownOptions.value[0]);
  let intervalId: ReturnType<typeof setInterval> | null = null;
  // interval steps calculations
  const progressStep = ref(10);
  const totalSteps = 3;
  const currentStep = 1;

  onMounted(() => {
    console.log('mounted');
    initInfoWindow();
  });

  const initInfoWindow = async () => {
    await getFilteredServices();
    setRefreshInterval();
  };

  const getFilteredServices = async () => {
    // get collection of unfinished
    activeServices.value = contractStore.items.filter(
      contract =>
        contract.contractStatus === ContractStatus.DEPLOY_INITIATED ||
        contract.contractStatus === ContractStatus.DEPLOYING
    );
    // return if no unfinished contracts
    if (activeServices.value === undefined) return;
    // open info window
    activeInfoWindow.value = true;

    const contracts = await contractStore.fetchContracts(false);
    console.log(contracts[0].contract_uuid);

    const contract = contracts.find(
      contract => contract.contract_uuid === activeServices.value.contract_uuid
    );
    if (!contract || contract.contractStatus >= CollectionStatus.DEPLOYED) {
      activeInfoWindow.value = false; // unmounts and clears interval
    }
  };

  const updateRefreshInterval = key => {
    const selectedOption = dropdownOptions.value.find(option => option.key === key);
    if (selectedOption) {
      refreshInterval.value = selectedOption;
      setRefreshInterval(); // Reset interval when the refresh interval changes
    }
  };

  const refresh = async () => {
    // Place the refresh logic here
    await getFilteredServices();
    calculateProgress();
  };

  const calculateProgress = () => {
    const progress = (currentStep / totalSteps) * 100;
    if (progress >= 100) {
      progressStep.value = 100;
      clearInterval(intervalId);
      intervalId = null;
    } else {
      // round up
      progressStep.value = Math.ceil(progress);
    }
  };

  const setRefreshInterval = () => {
    clearRefreshInterval();
    intervalId = setInterval(refresh, refreshInterval.value.value * 1000);
  };

  const clearRefreshInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  onBeforeUnmount(clearRefreshInterval);

  return {
    dropdownOptions,
    activeServices,
    progressStep,
    refreshInterval,
    updateRefreshInterval,
    refresh,
    activeInfoWindow,
    initInfoWindow,
  };
}
