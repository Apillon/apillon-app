export default function useScreen() {
  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const fileStore = useFileStore();
  const webpageStore = useWebpageStore();
  const deploymentStore = useDeploymentStore();
  const settingsStore = useSettingsStore();

  function clearAll() {
    dataStore.resetData();
    bucketStore.resetData();
    fileStore.resetData();
    webpageStore.resetData();
    deploymentStore.resetData();
    settingsStore.resetData();
  }

  function clearStorage() {
    bucketStore.resetData();
    fileStore.resetData();
    webpageStore.resetData();
    deploymentStore.resetData();
  }

  function clearHosting() {
    webpageStore.resetData();
    deploymentStore.resetData();
  }

  function clearSettings() {
    settingsStore.resetData();
  }

  return {
    clearAll,
    clearStorage,
    clearHosting,
    clearSettings,
  };
}
