export default function useIndexer() {
  const router = useRouter();
  const { params } = useRoute();
  const dataStore = useDataStore();
  const indexerStore = useIndexerStore();
  const indexerLogsStore = useIndexerLogStore();
  const indexerDeploymentsStore = useIndexerDeploymentsStore();
  const indexerBillingStore = useIndexerBillingStore();
  const pageLoading = ref<boolean>(true);

  async function initIndexer() {
    indexerStore.active = {} as IndexerInterface;

    const indexerUuid = params?.id ? params?.id : params?.slug;
    if (!indexerUuid) {
      router.push({ name: 'dashboard-service-indexing' });
    }

    await dataStore.waitOnPromises();

    const indexer = await indexerStore.items.find(i => i.indexer_uuid === indexerUuid);
    // const indexer = await indexerStore.getIndexer(`${indexerUuid}`);

    if (!indexer) {
      router.push({ name: 'dashboard-service-indexing' });
      return;
    }

    indexerStore.active = indexer;
    pageLoading.value = false;

    if (indexer.squidId) {
      // Get logs
      await indexerLogsStore.getLogs(indexer.indexer_uuid);
      // Get deployments
      await indexerDeploymentsStore.getDeployments(indexer.indexer_uuid);
      // Get billing data
      await indexerBillingStore.getIndexerBilling(indexer.indexer_uuid);
    }
  }

  return {
    pageLoading,
    initIndexer,
  };
}
