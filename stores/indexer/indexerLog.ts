import { defineStore } from 'pinia';

export const useIndexerLogStore = defineStore('indexerLog', {
  state: () => ({
    indexerUuid: '',
    items: [] as IndexerLogInterface[],
    nextPage: undefined,
    loading: false,
    search: '',
    filter: {
      logLevels: [],
      containers: [],
      dateFrom: undefined as Date | undefined,
    },
  }),
  actions: {
    resetData() {
      this.indexerUuid = '';
      this.items = [] as Array<IndexerLogInterface>;
      this.search = '';
      this.filter.logLevels = [];
      this.filter.containers = [];
      this.filter.dateFrom = undefined as Date | undefined;
    },

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
        /* const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 2); */
        const params = {
          limit: 200,
          search: this.search,
          // from: fromDate.toISOString(), // Last 2 days
          level: [],
          container: [],
        };
        /* if (this.filter.dateFrom) {
          params.from = new Date(this.filter.dateFrom).toISOString();
        } */
        if (this.filter.logLevels.length > 0) {
          params.level = this.filter.logLevels;
        }
        if (this.filter.containers.length > 0) {
          params.container = this.filter.containers;
        }

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
