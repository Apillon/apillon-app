import { defineStore } from 'pinia';

const dataStore = useDataStore();

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    active: {} as CollectionInterface,
    csvFile: {} as FileListItemType,
    items: [] as Array<CollectionInterface>,
    loading: false,
    quotaReached: undefined as Boolean | undefined,
    search: '',
    selected: 0,
    total: 0,
    uploadActive: false,
  }),
  getters: {
    hasCollections(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasCollectionItems(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
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

    async getCollection(collectionId: number): Promise<CollectionInterface> {
      if (this.active?.id === collectionId && !isCacheExpired(LsCacheKeys.COLLECTION)) {
        return this.active;
      }
      return await this.fetchCollection(collectionId);
    },
    async getCollectionQuota() {
      if (this.quotaReached === undefined) {
        await this.fetchCollectionQuota();
      }
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
        sessionStorage.setItem(LsCacheKeys.WEBSITES, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        /** Clear promise */
        dataStore.promises.collections = null;
        this.items = [] as Array<CollectionInterface>;
        this.total = 0;
        this.loading = false;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      return [];
    },

    async fetchCollection(id: number): Promise<CollectionInterface> {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }
      try {
        const res = await $api.get<CollectionResponse>(endpoints.collections);

        this.active = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.WEBSITE, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as CollectionInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as CollectionInterface;
    },

    async fetchCollectionQuota() {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<CollectionQuotaResponse>(endpoints.collection, {
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
