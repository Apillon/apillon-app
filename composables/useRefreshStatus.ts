enum IntervalType {
  FILE = 'file',
  JOB = 'job',
  CONTRACT = 'contract',
}
type Interval = ReturnType<typeof setInterval> | null;
type Deployment = {
  interval: Interval;
  progress: number;
  service: FileListItemType | JobInterface | ContractInterface | null;
};
type Deployments = Record<IntervalType, Deployment>;

const refreshStatusOptions = ref([
  { label: '10s', key: 1, value: 10000 },
  { label: '20s', key: 2, value: 20000 },
  { label: '30s', key: 3, value: 30000 },
  { label: '40s', key: 4, value: 40000 },
]);

const initDeployment = () => ({
  interval: null,
  progress: 0,
  service: null,
});

const refreshInterval = ref(refreshStatusOptions.value[2]);
const deployments = ref<Deployments>({
  file: initDeployment(),
  job: initDeployment(),
  contract: initDeployment(),
});

export default function useRefreshStatus() {
  const contractStore = useContractStore();
  const cloudFunctionStore = useCloudFunctionStore();

  const activeInfoWindow = computed(() =>
    Object.values(deployments.value).some(item => item?.interval)
  );
  const activeDeployments = computed(
    () =>
      Object.values(deployments.value).filter(item => !!item && item?.interval && item?.service) ||
      []
  );

  const setInitialRefreshInterval = () => {
    const refreshKey = localStorage.getItem(LS_KEYS.DEPLOYMENT_REFRESH_INTERVAL);
    const selectedOption = refreshStatusOptions.value.find(
      option => option.key === Number(refreshKey)
    );
    if (refreshKey && selectedOption) {
      refreshInterval.value = selectedOption;
    }
  };

  const updateRefreshInterval = (key: number) => {
    const selectedOption = refreshStatusOptions.value.find(option => option.key === key);
    if (selectedOption) {
      refreshInterval.value = selectedOption;
      refresh();
      localStorage.setItem(LS_KEYS.DEPLOYMENT_REFRESH_INTERVAL, `${key}`);
    }
  };

  const refresh = () => {
    if (deployments.value.job?.interval) checkUnfinishedJobs();
  };

  const clearIntervals = () => {
    clearIntervalContract();
    clearIntervalJob();
    clearIntervalFile();
  };
  const clearIntervalContract = () => {
    if (deployments.value.contract.interval) {
      clearInterval(deployments.value.contract.interval);

      if (deployments.value.contract.progress >= 100) {
        deployments.value.contract.interval = null;
        deployments.value.contract.progress = 0;
        deployments.value.contract.service = null;
      }
    }
  };
  const clearIntervalJob = () => {
    if (deployments.value.job.interval) {
      clearInterval(deployments.value.job?.interval);

      if (deployments.value.job.progress >= 100) {
        deployments.value.job.interval = null;
        deployments.value.job.progress = 0;
        deployments.value.job.service = null;
      }
    }
  };
  const clearIntervalFile = () => {
    if (deployments.value.file.interval) {
      clearInterval(deployments.value.file.interval);

      if (deployments.value.file.progress >= 100) {
        deployments.value.file.interval = null;
        deployments.value.file.progress = 0;
        deployments.value.file.service = null;
      }
    }
  };

  const calcProgress = (currentProgress: number, interval?: number) => {
    const intervalInSeconds = interval ? interval * 0.1 : refreshInterval.value.key;
    if (currentProgress < 30) return currentProgress + intervalInSeconds * 5;
    if (currentProgress < 50) return currentProgress + intervalInSeconds * 4;
    if (currentProgress < 70) return currentProgress + intervalInSeconds * 3;
    if (currentProgress < 80) return currentProgress + intervalInSeconds * 2;
    if (currentProgress < 88) return currentProgress + intervalInSeconds;
    if (currentProgress < 92) return currentProgress + intervalInSeconds * 0.5;
    if (currentProgress < 95) return currentProgress + intervalInSeconds * 0.4;
    if (currentProgress < 97) return currentProgress + intervalInSeconds * 0.6;
    if (currentProgress < 98) return currentProgress + intervalInSeconds * 0.8;
    if (currentProgress < 99) return currentProgress + intervalInSeconds * 0.1;
    if (currentProgress < 100) return currentProgress + intervalInSeconds * 0.2;
    return currentProgress;
  };

  onMounted(() => {
    setInitialRefreshInterval();
  });
  onBeforeUnmount(clearIntervals);

  /** Contract polling */
  function checkUnfinishedContracts() {
    clearIntervalContract();

    const unfinishedCollection = contractStore.items.find(
      contract => contract.contractStatus < ContractStatus.DEPLOYED
    );
    if (unfinishedCollection === undefined) return;

    deployments.value.contract.service = unfinishedCollection;
    deployments.value.contract.progress = deployments.value.contract?.progress || 1;

    const progressInterval = setInterval(() => {
      deployments.value.contract.progress = calcProgress(deployments.value.contract.progress, 0.1);
    }, 100);

    deployments.value.contract.interval = setInterval(async () => {
      const contracts = await contractStore.fetchContracts(false, false);
      const contract = contracts.find(
        contract => contract.contract_uuid === unfinishedCollection.contract_uuid
      );
      if (!contract || contract.contractStatus >= CollectionStatus.DEPLOYED) {
        deployments.value.contract.progress = 100;

        clearInterval(progressInterval);
        clearIntervalContract();
      }
    }, refreshInterval.value.value);
  }

  /** Cloud function polling */
  function checkUnfinishedJobs() {
    clearIntervalJob();

    const unfinishedJob = cloudFunctionStore.jobs.find(
      job => !job?.jobStatus || job.jobStatus < AcurastJobStatus.DEPLOYED
    );
    if (unfinishedJob === undefined) return;

    deployments.value.job.service = unfinishedJob;
    deployments.value.job.progress = deployments.value.job?.progress || 1;

    const progressInterval = setInterval(() => {
      deployments.value.job.progress = calcProgress(deployments.value.job.progress, 0.1);
    }, 100);

    deployments.value.job.interval = setInterval(async () => {
      if (deployments.value.job?.progress) {
        deployments.value.job.progress = calcProgress(deployments.value.job.progress);
      }
      const cloudFunction = await cloudFunctionStore.fetchCloudFunction(
        cloudFunctionStore.functionUuid,
        false
      );
      const job = cloudFunction.jobs.find(job => job.job_uuid === unfinishedJob.job_uuid);

      if (!job || job.jobStatus >= AcurastJobStatus.DEPLOYED) {
        deployments.value.job.progress = 100;
        cloudFunctionStore.active = cloudFunction;

        clearInterval(progressInterval);
        clearIntervalJob();
      }
    }, refreshInterval.value.value);
  }

  return {
    activeInfoWindow,
    activeDeployments,
    deployments,
    refreshStatusOptions,
    refreshInterval,
    calcProgress,
    checkUnfinishedJobs,
    clearIntervals,
    clearIntervalFile,
    clearIntervalJob,
    refresh,
    checkUnfinishedContracts,
    updateRefreshInterval,
  };
}
