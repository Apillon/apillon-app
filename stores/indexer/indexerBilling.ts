import { defineStore } from 'pinia';

export const useIndexerBillingStore = defineStore('indexerBilling', {
  state: () => ({
    active: {} as IndexerBillingInterface,
    items: [] as IndexerBillingInterface[],
    loading: false,
    search: '',
  }),
  getters: {
    hasItems(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as IndexerBillingInterface;
      this.items = [] as Array<IndexerBillingInterface>;
      this.search = '';
    },

    async getIndexerBilling(indexerUUID: string) {
      if (this.hasItems && !isCacheExpired(LsCacheKeys.INDEXER_BILLING)) {
        return this.items;
      }
      return await this.fetchIndexerBilling(indexerUUID);
    },

    /**
     * API calls
     */
    async fetchIndexerBilling(indexerUUID: string, showLoader: boolean = true) {
      this.loading = showLoader;
      try {
        const params = parseArguments({
          search: this.search,
          page: PARAMS_ALL_ITEMS.page,
          limit: PARAMS_ALL_ITEMS.limit,
        });

        const res = await $api.get<IndexerBillingResponse>(endpoints.indexerBilling(indexerUUID), params);
        this.items = res.data.items;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.INDEXER_BILLING, Date.now().toString());
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
