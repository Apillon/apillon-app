export default function useStore() {
  const bucketStore = useBucketStore();
  const cloudFunctionStore = useCloudFunctionStore();
  const collectionStore = useCollectionStore();
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
  const rpcApiKeyStore = useRpcApiKeyStore();
  const rpcEndpointStore = useRpcEndpointStore();
  const settingsStore = useSettingsStore();
  const simpletStore = useSimpletStore();
  const storageStore = useStorageStore();
  const websiteStore = useWebsiteStore();

  function clearAll() {
    cloudFunctionStore.resetData();
    dataStore.resetData();
    deployedContractStore.resetData();
    embeddedWalletStore.resetData();
    paymentStore.resetData();
    settingsStore.resetData();
    simpletStore.resetData();
    clearIndexer();
    clearNft();
    clearRpc();
    clearStorage();
  }

  function clearNft() {
    collectionStore.resetData();
    metadataStore.resetData();
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

  function clearRpc() {
    rpcApiKeyStore.reset();
    rpcEndpointStore.reset();
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
  };
}
