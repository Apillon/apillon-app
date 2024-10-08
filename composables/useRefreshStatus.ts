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
  title: String | null;
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
  title: null,
});

const refreshInterval = ref(refreshStatusOptions.value[2]);
const deployments = reactive<Deployments>({
  file: initDeployment(),
  job: initDeployment(),
  contract: initDeployment(),
});

export default function useRefreshStatus() {
  const activeDeployments = computed(
    () => Object.values(deployments).filter(item => !!item && (item?.service || item?.title)) || []
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

  const refresh = () => {};

  const clearIntervals = () => {
    clearIntervalJob(false);
  };
  const clearIntervalJob = async (finished: boolean = true) => {
    if (deployments.job.interval) {
      clearInterval(deployments.job?.interval);
    }

    if (deployments.job.progress >= 100 || finished) {
      await sleep(1000);
      deployments.job.interval = null;
      deployments.job.progress = 0;
      deployments.job.service = null;
      deployments.job.title = null;
    }
  };

  const calcProgress = (currentProgress: number, interval?: number) => {
    const intervalInSeconds = interval ? interval * 0.1 : refreshInterval.value.key;
    if (currentProgress < 30) return currentProgress + intervalInSeconds * 17;
    if (currentProgress < 50) return currentProgress + intervalInSeconds * 14;
    if (currentProgress < 70) return currentProgress + intervalInSeconds * 12;
    if (currentProgress < 80) return currentProgress + intervalInSeconds * 10;
    if (currentProgress < 88) return currentProgress + intervalInSeconds * 6;
    if (currentProgress < 92) return currentProgress + intervalInSeconds * 2;
    if (currentProgress < 95) return currentProgress + intervalInSeconds * 1;
    if (currentProgress < 97) return currentProgress + intervalInSeconds * 0.6;
    if (currentProgress < 98) return currentProgress + intervalInSeconds * 0.3;
    if (currentProgress < 99) return currentProgress + intervalInSeconds * 0.1;
    if (currentProgress < 100) return currentProgress + intervalInSeconds * 0.05;
    return currentProgress;
  };

  onMounted(() => {
    setInitialRefreshInterval();
  });

  function setDeploymentStatus(type: IntervalType, title: string) {
    deployments[type].title = title;
    setInterval(() => {
      deployments[type].progress = calcProgress(deployments[type].progress, 0.1);
    }, 100);
  }
  function updateDeploymentStatus(type: IntervalType, title: string) {
    deployments[type].title = title;
  }

  function setJobStatus(title?: string | null) {
    setDeploymentStatus(IntervalType.JOB, title || '');
  }
  function updateJobStatus(title?: string | null) {
    updateDeploymentStatus(IntervalType.JOB, title || '');
  }

  return {
    activeDeployments,
    deployments,
    refreshStatusOptions,
    refreshInterval,
    calcProgress,
    clearIntervals,
    clearIntervalJob,
    refresh,
    setJobStatus,
    updateJobStatus,
    updateRefreshInterval,
  };
}
