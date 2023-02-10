export default function useScreen() {
  const dataStore = useDataStore();
  const bucketStore = useBucketStore();
  const fileStore = useFileStore();
  const webpageStore = useWebpageStore();
  const deploymentStore = useDeploymentStore();

  function clearAll() {
    dataStore.resetData();
    bucketStore.resetData();
    fileStore.resetData();
    webpageStore.resetData();
    deploymentStore.resetData();
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

  return {
    clearAll,
    clearStorage,
    clearHosting,
  };
}
