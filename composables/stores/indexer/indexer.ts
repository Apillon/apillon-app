import { defineStore } from 'pinia';

export const useIndexerStore = defineStore('indexer', {
  state: () => ({
    active: {} as IndexerInterface,
    items: [] as IndexerBaseInterface[],
    loading: false,
    search: '',
  }),
  getters: {
    hasIndexers(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as IndexerInterface;
      this.items = [] as Array<IndexerBaseInterface>;
      this.search = '';
    },

    /**
     * Fetch wrappers
     */
    async getIndexers() {
      if (this.hasIndexers && !isCacheExpired(LsCacheKeys.INDEXERS)) {
        return this.items;
      }
      return await this.fetchIndexers();
    },

    async getIndexer(indexerUUID: string) {
      if (this.active?.indexer_uuid === indexerUUID && !isCacheExpired(LsCacheKeys.INDEXER)) {
        return this.active;
      }
      return await this.fetchIndexer(indexerUUID);
    },

    /**
     * API calls
     */
    async fetchIndexers(showLoader: boolean = true) {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      this.loading = showLoader;
      try {
        const params = parseArguments({
          search: this.search,
          project_uuid: dataStore.projectUuid,
          page: PARAMS_ALL_ITEMS.page,
          limit: PARAMS_ALL_ITEMS.limit,
        });

        const res = await $api.get<IndexersResponse>(endpoints.indexers(), params);
        this.items = res.data.items;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.INDEXERS, Date.now().toString());
      } catch (error: any) {
        this.items = [];
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
      return this.items;
    },

    async fetchIndexer(indexerUUID: string, showLoader: boolean = true) {
      this.loading = showLoader;
      try {
        const res = await $api.get<IndexerResponse>(endpoints.indexers(indexerUUID));
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.INDEXER, Date.now().toString());

        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
      return null;
    },

    async hibernateIndexer(indexerUUID: string, showLoader: boolean = true) {
      this.loading = showLoader;
      try {
        await $api.post(endpoints.indexerHibernate(indexerUUID));
        this.loading = false;

        return true;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
    },

    async deleteIndexer(indexerUUID: string, showLoader: boolean = true) {
      this.loading = showLoader;
      try {
        await $api.delete(endpoints.indexers(indexerUUID));
        this.loading = false;

        this.items = this.items.filter(item => item.indexer_uuid !== indexerUUID);

        return true;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
    },
  },
});
