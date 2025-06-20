import { defineStore } from 'pinia';

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    active: {} as CollectionInterface,
    items: [] as CollectionInterface[],
    nfts: [] as MetadataItem[],
    loading: false,
    metadataDeploys: [] as MetadataDeployInterface[],
    modalCreateVisible: false,
    pagination: createPagination(false),
    search: '',
    quotaReached: undefined as boolean | undefined,
    transaction: [] as TransactionInterface[],
    archive: {
      items: [] as CollectionInterface[],
      loading: false,
      pagination: createPagination(false),
      search: '',
    },
  }),
  getters: {
    collectionUuid(state): string {
      return state.active.collection_uuid;
    },
    hasCollections(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasCollectionArchive(state): boolean {
      return Array.isArray(state.archive.items) && state.archive.items.length > 0;
    },
    hasCollectionTransactions(state): boolean {
      return Array.isArray(state.transaction) && state.transaction.length > 0;
    },
    hasMetadataDeploys(state): boolean {
      return Array.isArray(state.metadataDeploys) && state.metadataDeploys.length > 0;
    },
    isUnique(state): boolean {
      return state.active.chain === SubstrateChain.UNIQUE;
    },
  },
  actions: {
    resetData() {
      this.active = {} as CollectionInterface;
      this.items = [] as CollectionInterface[];
      this.nfts = [] as MetadataItem[];
      this.search = '';
      this.transaction = [] as TransactionInterface[];
      this.archive.items = [] as CollectionInterface[];
      this.archive.search = '';
    },

    resetCache() {
      sessionStorage.removeItem(LsCacheKeys.COLLECTION);
      sessionStorage.removeItem(LsCacheKeys.COLLECTIONS);
      sessionStorage.removeItem(LsCacheKeys.COLLECTION_TRANSACTIONS);
      sessionStorage.removeItem(LsCacheKeys.COLLECTION_QUOTA);
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
    async getCollectionArchive(): Promise<CollectionInterface[]> {
      if (!this.hasCollectionArchive || isCacheExpired(LsCacheKeys.COLLECTION_ARCHIVE)) {
        return await this.fetchCollections(true);
      }
      return this.archive.items;
    },

    async getCollection(collectionUuid: string): Promise<CollectionInterface | null> {
      if (
        this.active?.collection_uuid === collectionUuid &&
        this.active?.collectionStatus >= CollectionStatus.DEPLOYED &&
        !isCacheExpired(LsCacheKeys.COLLECTION)
      ) {
        return this.active;
      }
      return await this.fetchCollection(collectionUuid);
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
    async getMetadataDeploys(collectionUuid?: string): Promise<MetadataDeployInterface[]> {
      if (
        !this.hasMetadataDeploys ||
        isCacheExpired(LsCacheKeys.COLLECTION_METADATA) ||
        (collectionUuid && this.active?.collection_uuid !== collectionUuid)
      ) {
        return await this.fetchMetadataDeploys(collectionUuid);
      }
      return this.metadataDeploys;
    },

    /** GET Collection quota, if current value is undefined  */
    async getQuota() {
      if (this.quotaReached === undefined || isCacheExpired(LsCacheKeys.COLLECTION_QUOTA)) {
        await this.fetchQuota();
      }
      return this.quotaReached;
    },

    /**
     * API calls
     */
    async fetchCollections(archive = false, showLoader = true): Promise<CollectionInterface[]> {
      const dataStore = useDataStore();
      if (!dataStore.projectUuid) return [];

      (archive ? this.archive : this).loading = showLoader;
      try {
        const params = parseArguments(PARAMS_ALL_ITEMS);
        params.project_uuid = dataStore.projectUuid;
        if (archive) params.status = SqlModelStatus.ARCHIVED;

        const req = $api.get<CollectionsResponse>(endpoints.collections(), params);
        dataStore.promises.collections = req;
        const res = await req;

        (archive ? this.archive : this).items = res.data.items;
        (archive ? this.archive : this).pagination.itemCount = res.data.total;
        (archive ? this.archive : this).search = '';
        (archive ? this.archive : this).loading = false;
        /** Save timestamp to SS */
        const key = archive ? LsCacheKeys.COLLECTION_ARCHIVE : LsCacheKeys.COLLECTIONS;
        sessionStorage.setItem(key, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        /** Clear promise */
        dataStore.promises.collections = null;

        (archive ? this.archive : this).items = [];
        (archive ? this.archive : this).pagination.itemCount = 0;
        (archive ? this.archive : this).search = '';
        (archive ? this.archive : this).loading = false;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      return [];
    },

    async fetchCollection(uuid: string): Promise<CollectionInterface | null> {
      if (!uuid) return null;
      try {
        const res = await $api.get<CollectionResponse>(endpoints.collections(uuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COLLECTION, Date.now().toString());

        return res.data;
      } catch (error: any) {
        console.error(error);
        this.active = {} as CollectionInterface;
      }
      return null;
    },

    async fetchCollectionTransactions(collectionUuid: string, showLoader = true): Promise<TransactionInterface[]> {
      this.loading = showLoader;
      try {
        const res = await $api.get<TransactionResponse>(
          endpoints.collectionTransactions(collectionUuid),
          PARAMS_ALL_ITEMS
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

    async fetchMetadataDeploys(collectionUuid?: string): Promise<MetadataDeployInterface[]> {
      try {
        const res = await $api.get<MetadataDeploysResponse>(
          endpoints.collectionNftsMetadata(collectionUuid || this.collectionUuid),
          parseArguments({ ...PARAMS_ALL_ITEMS })
        );

        this.metadataDeploys = res.data.items;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COLLECTION_METADATA, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.metadataDeploys = [] as Array<MetadataDeployInterface>;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return [];
    },

    async fetchQuota() {
      const dataStore = useDataStore();
      if (!dataStore.projectUuid) return [];

      try {
        const res = await $api.get<BooleanResponse>(endpoints.collectionsQuota, {
          project_uuid: dataStore.projectUuid,
        });
        this.quotaReached = res.data;
      } catch (error: any) {
        this.quotaReached = undefined;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },
  },
});
