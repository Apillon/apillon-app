import { defineStore } from 'pinia';

export const useIndexerStore = defineStore('indexer', {
  state: () => ({
    active: {} as IndexerInterface,
    items: [] as IndexerBaseInterface[],
    loading: false,
    pagination: createPagination(),
    search: '',
  }),
  getters: {
    hasIndexers(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },
  actions: {
    /**
     * Fetch wrappers
     */
    async getIndexers(page = 1, limit = PAGINATION_LIMIT) {
      if (
        page === this.pagination.page &&
        this.hasIndexers &&
        !isCacheExpired(LsCacheKeys.INDEXERS)
      ) {
        return this.items;
      }
      return await this.fetchIndexers(page, limit);
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
    async fetchIndexers(page = 1, limit = PAGINATION_LIMIT, showLoader: boolean = true) {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      this.loading = showLoader;
      try {
        const params = parseArguments({
          limit,
          page,
          search: this.search,
          project_uuid: dataStore.projectUuid,
        });

        const res = await $api.get<IndexersResponse>(endpoints.indexers(), params);
        this.items = res.data.items;
        this.pagination.itemCount = res.data.total;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.INDEXERS, Date.now().toString());
      } catch (error: any) {
        this.items = [];
        this.pagination.itemCount = 0;

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
  },
});
