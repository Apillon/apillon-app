import { defineStore } from 'pinia';

export const useIndexerLogStore = defineStore('indexerLog', {
  state: () => ({
    indexerUuid: '',
    items: [] as IndexerLogInterface[],
    nextPage: undefined,
    loading: false,
    pagination: createPagination(),
    search: '',
  }),
  actions: {
    /**
     * Fetch wrappers
     */
    async getLogs(indexerUuid: string, page = 1, limit = PAGINATION_LIMIT) {
      if (
        this.indexerUuid === indexerUuid &&
        page === this.pagination.page &&
        !isCacheExpired(LsCacheKeys.INDEXER_LOGS)
      ) {
        return this.items;
      }
      return await this.fetchLogs(indexerUuid, page, limit);
    },

    /**
     * API calls
     */
    async fetchLogs(
      indexerUuid: string,
      page = 1,
      limit = PAGINATION_LIMIT,
      showLoader: boolean = true
    ) {
      this.loading = showLoader;
      this.indexerUuid = indexerUuid;
      try {
        const params = parseArguments({
          limit,
          page,
          search: this.search,
        });

        const res = await $api.get<IndexerLogsResponse>(
          endpoints.indexerLogs(this.indexerUuid),
          params
        );
        this.items = res.data.logs;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.INDEXER_LOGS, Date.now().toString());
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
  },
});
