import { defineStore } from 'pinia';

const dataStore = useDataStore();

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    active: {} as CollectionInterface,
    csvFile: {} as FileListItemType,
    images: [] as Array<FileListItemType>,
    items: [] as Array<CollectionInterface>,
    loading: false,
    mintTab: NftMintTab.METADATA,
    quotaReached: undefined as Boolean | undefined,
    search: '',
    selected: 0,
    total: 0,
    transaction: [] as Array<TransactionInterface>,
    uploadActive: false,
  }),
  getters: {
    hasCollections(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasCollectionTransactions(state): boolean {
      return Array.isArray(state.transaction) && state.transaction.length > 0;
    },
    hasCsvFile(state): boolean {
      return !!state.csvFile?.id;
    },
    hasImages(state): boolean {
      return Array.isArray(state.images) && state.images.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as CollectionInterface;
      this.items = [] as Array<CollectionInterface>;
      this.search = '';
      this.selected = 0;
      this.quotaReached = undefined;
    },
    setCollectionId(id: number) {
      if (this.selected !== id) {
        this.selected = id;
      }
    },

    /**
     * Fetch wrappers
     */
    async getCollections(): Promise<CollectionInterface[]> {
      if (!this.hasCollections || isCacheExpired(LsCacheKeys.COLLECTIONS)) {
        return await this.fetchCollections();
      }
      return this.items;
    },

    async getCollectionTransactions(collectionUuid: string): Promise<any> {
      if (
        this.active?.collection_uuid === collectionUuid &&
        (!this.hasCollectionTransactions || !isCacheExpired(LsCacheKeys.COLLECTION_TRANSACTIONS))
      ) {
        return this.transaction;
      }
      return await this.fetchCollectionTransactions(collectionUuid);
    },

    /**
     * API calls
     */
    async fetchCollections(): Promise<CollectionInterface[]> {
      this.loading = true;
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
          ...PARAMS_ALL_ITEMS,
        };

        const req = $api.get<CollectionsResponse>(endpoints.collections, params);
        dataStore.promises.collections = req;
        const res = await req;

        this.items = res.data.items;
        this.total = res.data.total;
        this.search = '';
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COLLECTIONS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        /** Clear promise */
        dataStore.promises.collections = null;
        this.items = [] as Array<CollectionInterface>;
        this.total = 0;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      this.loading = false;
      return [];
    },

    async fetchCollectionTransactions(collectionUuid: string): Promise<TransactionInterface[]> {
      this.loading = true;
      try {
        const res = await $api.get<TransactionResponse>(
          endpoints.collectionTransactions(collectionUuid)
        );
        this.transaction = res.data.items;
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COLLECTION_TRANSACTIONS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.transaction = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
      return [];
    },
  },
});
