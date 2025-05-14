export default function useStore() {
  const bucketStore = useBucketStore();
  const chatStore = useChatStore();
  const cloudFunctionStore = useCloudFunctionStore();
  const collectionStore = useCollectionStore();
  const contractStore = useContractStore();
  const dataStore = useDataStore();
  const deployedContractStore = useDeployedContractStore();
  const deploymentStore = useDeploymentStore();
  const embeddedWalletStore = useEmbeddedWalletStore();
  const fileStore = useFileStore();
  const indexerStore = useIndexerStore();
  const indexerLogStore = useIndexerLogStore();
  const indexerDeploymentsStore = useIndexerDeploymentsStore();
  const ipfsStore = useIpfsStore();
  const ipnsStore = useIpnsStore();
  const metadataStore = useMetadataStore();
  const paymentStore = usePaymentStore();
  const postStore = usePostStore();
  const rpcApiKeyStore = useRpcApiKeyStore();
  const rpcEndpointStore = useRpcEndpointStore();
  const settingsStore = useSettingsStore();
  const storageStore = useStorageStore();
  const websiteStore = useWebsiteStore();

  function clearAll() {
    dataStore.resetData();
    embeddedWalletStore.resetData();
    clearComputing();
    clearIndexer();
    clearNft();
    clearPayments();
    clearRpc();
    clearSettings();
    clearSmartContracts();
    clearSocial();
    clearStorage();
  }

  function clearNft() {
    collectionStore.resetData();
    metadataStore.resetData();
  }

  function clearComputing() {
    contractStore.resetData();
    cloudFunctionStore.resetData();
  }

  function clearHosting() {
    websiteStore.resetData();
    deploymentStore.resetData();
  }

  function clearIndexer() {
    indexerStore.resetData();
    indexerLogStore.resetData();
    indexerDeploymentsStore.resetData();
  }

  function clearPayments() {
    paymentStore.resetData();
  }

  function clearRpc() {
    rpcApiKeyStore.reset();
    rpcEndpointStore.reset();
  }

  function clearSettings() {
    settingsStore.resetData();
  }

  function clearSmartContracts() {
    deployedContractStore.resetData();
  }

  function clearSocial() {
    chatStore.resetData();
    postStore.resetData();
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

  return {
    clearAll,
    clearStorage,
    clearHosting,
    clearNft,
    clearSettings,
  };
}
