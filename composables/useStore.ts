export default function useScreen() {
  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const fileStore = useFileStore();
  const ipnsStore = useIpnsStore();
  const websiteStore = useWebsiteStore();
  const deploymentStore = useDeploymentStore();
  const settingsStore = useSettingsStore();

  function clearAll() {
    dataStore.resetData();
    bucketStore.resetData();
    fileStore.resetData();
    ipnsStore.resetData();
    websiteStore.resetData();
    deploymentStore.resetData();
    settingsStore.resetData();
  }

  function clearStorage() {
    bucketStore.resetData();
    fileStore.resetData();
    ipnsStore.resetData();
    websiteStore.resetData();
    deploymentStore.resetData();
  }

  function clearHosting() {
    websiteStore.resetData();
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
