export default function useStore() {
  const dataStore = useDataStore();
  const storageStore = useStorageStore();
  const bucketStore = useBucketStore();
  const chatStore = useChatStore();
  const embeddedWalletStore = useEmbeddedWalletStore();
  const postStore = usePostStore();
  const cloudFunctionStore = useCloudFunctionStore();
  const contractStore = useContractStore();
  const fileStore = useFileStore();
  const ipfsStore = useIpfsStore();
  const ipnsStore = useIpnsStore();
  const websiteStore = useWebsiteStore();
  const deploymentStore = useDeploymentStore();
  const collectionStore = useCollectionStore();
  const paymentStore = usePaymentStore();
  const settingsStore = useSettingsStore();

  function clearAll() {
    dataStore.resetData();
    embeddedWalletStore.resetData();
    clearStorage();
    clearCollection();
    clearComputing();
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

  function clearComputing() {
    contractStore.resetData();
    cloudFunctionStore.resetData();
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
