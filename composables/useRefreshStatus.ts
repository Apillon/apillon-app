import { ref, onMounted, onBeforeUnmount } from 'vue';
// const contractStore = useContractStore();

const options = ref([
  { label: '10s', key: 0, value: 10 },
  { label: '20s', key: 1, value: 20 },
  { label: '30s', key: 2, value: 30 },
  { label: '40s', key: 3, value: 40 },
]);

export default function useRefreshStatus() {
  // const contractStore = useContractStore();

  const activeServices = ref([
    { title: 'Sch1', id: 0 },
    { title: 'Sch2', id: 1 },
    { title: 'Sch3', id: 2 },
  ]);

  const progressStep = ref(10);
  const refreshInterval = ref(options.value[0]);
  const expanded = ref(false);

  let intervalId: ReturnType<typeof setInterval> | null = null;
  const totalSteps = 3;
  let currentStep = 1;

  const updateRefreshInterval = key => {
    const selectedOption = options.value.find(option => option.key === key);
    console.log(key);
    if (selectedOption) {
      refreshInterval.value = selectedOption;
      setRefreshInterval(); // Reset interval when the refresh interval changes
    }
  };

  const refresh = async () => {
    // Place the refresh logic here
    // const result = await contractStore.fetchContracts(false);
    console.log(result);
    checkUnfinishedContracts();

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
      currentStep++;
    }
  };

  const clearRefreshInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const setRefreshInterval = () => {
    clearRefreshInterval();
    intervalId = setInterval(refresh, refreshInterval.value.value * 1000);
  };

  onMounted(() => {
    setRefreshInterval();
  });

  onBeforeUnmount(clearRefreshInterval);

  return {
    options,
    activeServices,
    progressStep,
    refreshInterval,
    expanded,
    updateRefreshInterval,
    refresh,
  };
}
