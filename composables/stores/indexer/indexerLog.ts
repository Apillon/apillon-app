import { defineStore } from 'pinia';

export const useIndexerLogStore = defineStore('indexerLog', {
  state: () => ({
    indexerUuid: '',
    items: [] as IndexerLogInterface[],
    nextPage: undefined,
    loading: false,
    search: '',
  }),
  actions: {
    /**
     * Fetch wrappers
     */
    async getLogs(indexerUuid: string) {
      if (this.indexerUuid === indexerUuid && !isCacheExpired(LsCacheKeys.INDEXER_LOGS)) {
        return this.items;
      }
      return await this.fetchLogs(indexerUuid);
    },

    /**
     * API calls
     */
    async fetchLogs(indexerUuid: string, showLoader: boolean = true) {
      this.loading = showLoader;
      this.indexerUuid = indexerUuid;
      try {
        const params = {
          limit: 200,
          search: this.search,
        };

        const res = await $api.get<IndexerLogsResponse>(
          endpoints.indexerLogs(this.indexerUuid),
          params
        );
        this.items = res.data.logs;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.INDEXER_LOGS, Date.now().toString());
      } catch (error: any) {
        this.items = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
      return this.items;
    },
  },
});
