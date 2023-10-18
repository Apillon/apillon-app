export default function useStore() {
  const dataStore = useDataStore();
  const storageStore = useStorageStore();
  const bucketStore = useBucketStore();
  const fileStore = useFileStore();
  const ipnsStore = useIpnsStore();
  const websiteStore = useWebsiteStore();
  const deploymentStore = useDeploymentStore();
  const collectionStore = useCollectionStore();
  const paymentsStore = usePaymentsStore();
  const settingsStore = useSettingsStore();

  function clearAll() {
    dataStore.resetData();
    clearStorage();
    clearCollection();
    clearPayments();
    clearSettings();
  }

  function clearStorage() {
    storageStore.resetData();
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

  function clearCollection() {
    collectionStore.resetData();
  }

  function clearPayments() {
    paymentsStore.resetData();
  }

  function clearSettings() {
    settingsStore.resetData();
  }

  return {
    clearAll,
    clearStorage,
    clearHosting,
    clearCollection,
    clearSettings,
  };
}
