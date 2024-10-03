export default function useIndexer() {
  const router = useRouter();
  const { params } = useRoute();
  const dataStore = useDataStore();
  const indexerStore = useIndexerStore();
  const pageLoading = ref<boolean>(true);

  async function initIndexer() {
    const indexerUuid = params?.id ? params?.id : params?.slug;
    if (!indexerUuid) {
      router.push({ name: 'dashboard-service-indexer' });
    }

    await Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const indexer = await indexerStore.getIndexer(`${indexerUuid}`);

      if (!indexer) {
        router.push({ name: 'dashboard-service-indexer' });
      } else {
        indexerStore.active = indexer;
        pageLoading.value = false;
      }
    });
  }

  return {
    initIndexer,
  };
}
