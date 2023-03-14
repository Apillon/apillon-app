import { defineStore } from 'pinia';

const dataStore = useDataStore();

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    active: {} as CollectionInterface,
    csvAttributes: [] as Array<MetadataAttributes>,
    csvColumns: [] as NTableColumns<KeyTitle>,
    csvData: [] as Array<Record<string, string>>,
    csvFile: {} as FileListItemType,
    csvSelectedAttributes: [] as Array<string>,
    csvSession: '',
    filesMetadata: [] as FileListItemType[],
    images: [] as FileListItemType[],
    imagesSession: '',
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
      return !!state.csvFile?.id && Array.isArray(state.csvData) && state.csvData.length > 0;
    },
    hasImages(state): boolean {
      return Array.isArray(state.images) && state.images.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as CollectionInterface;
      this.csvFile = {} as FileListItemType;
      this.images = [] as Array<FileListItemType>;
      this.items = [] as Array<CollectionInterface>;
      this.search = '';
      this.selected = 0;
      this.transaction = [] as Array<TransactionInterface>;
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

    async getCollection(collectionId: number): Promise<CollectionInterface> {
      if (this.active?.id === collectionId && !isCacheExpired(LsCacheKeys.COLLECTION)) {
        return this.active;
      }
      return await this.fetchCollection(collectionId);
    },

    async getCollectionTransactions(collectionUuid: string): Promise<any> {
      if (
        this.active?.collection_uuid !== collectionUuid ||
        !this.hasCollectionTransactions ||
        isCacheExpired(LsCacheKeys.COLLECTION_TRANSACTIONS)
      ) {
        return await this.fetchCollectionTransactions(collectionUuid);
      }
      return this.transaction;
    },

    /**
     * API calls
     */
    async fetchCollections(showLoader: boolean = true): Promise<CollectionInterface[]> {
      this.loading = showLoader;
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
          ...PARAMS_ALL_ITEMS,
        };

        const req = $api.get<CollectionsResponse>(endpoints.collections(), params);
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

    async fetchCollection(id: number): Promise<CollectionInterface> {
      try {
        const res = await $api.get<CollectionResponse>(endpoints.collections(id));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COLLECTION, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as CollectionInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as CollectionInterface;
    },

    async fetchCollectionTransactions(
      collectionUuid: string,
      showLoader: boolean = true
    ): Promise<TransactionInterface[]> {
      this.loading = showLoader;
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
