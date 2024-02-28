export default function useStore() {
  const dataStore = useDataStore();
  const storageStore = useStorageStore();
  const bucketStore = useBucketStore();
  const chatStore = useChatStore();
  const postStore = usePostStore();
  const fileStore = useFileStore();
  const ipfsStore = useIpfsStore();
  const ipnsStore = useIpnsStore();
  const websiteStore = useWebsiteStore();
  const deploymentStore = useDeploymentStore();
  const collectionStore = useCollectionStore();
  const paymentStore = usePaymentStore();
  const settingsStore = useSettingsStore();

  function clearAll() {
    dataStore.resetCurrentProject();
    clearStorage();
    clearCollection();
    clearPayments();
    clearSettings();
    clearSocial();
  }

  function clearStorage() {
    storageStore.resetData();
    bucketStore.resetData();
    fileStore.resetData();
    ipfsStore.resetData();
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
    paymentStore.resetData();
  }

  function clearSettings() {
    settingsStore.resetData();
  }

  function clearSocial() {
    chatStore.resetData();
    postStore.resetData();
  }

  return {
    clearAll,
    clearStorage,
    clearHosting,
    clearCollection,
    clearSettings,
  };
}
