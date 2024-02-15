import { defineStore } from 'pinia';

export const useComputingTransactionStore = defineStore('computingTransaction', {
  state: () => ({
    active: {} as ComputingTransactionInterface,
    loading: false,
    search: '',
    items: [] as ComputingTransactionInterface[],
    pagination: {
      page: 1,
      pageSize: PAGINATION_LIMIT,
      itemCount: 0,
    },
  }),
  getters: {
    hasTransactions(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as ComputingTransactionInterface;
      this.items = [] as ComputingTransactionInterface[];
      this.search = '';
    },

    /**
     * Fetch wrappers
     */
    async getTransactions(contractUuid: string, page = 1): Promise<any> {
      if ((page !== this.pagination.page, isCacheExpired(LsCacheKeys.COMPUTING_TRANSACTIONS))) {
        return await this.fetchTransactions(contractUuid, page);
      }
      return this.items;
    },

    /**
     * API calls
     */
    async fetchTransactions(
      contractUuid: string,
      page = 1,
      showLoader = true
    ): Promise<ComputingTransactionInterface[]> {
      const dataStore = useDataStore();
      if (!dataStore.projectUuid) {
        return [];
      }

      this.loading = showLoader;

      try {
        const params = parseArguments({ page, search: this.search });
        params.project_uuid = dataStore.projectUuid;
        params.contract_uuid = contractUuid;

        const res = await $api.get<ComputingTransactionResponse>(
          endpoints.contractTransactions(contractUuid),
          params
        );
        this.items = res.data.items;
        this.pagination.page = page;
        this.pagination.itemCount = res.data.total;
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COMPUTING_TRANSACTIONS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.items = [];
        this.pagination.itemCount = 0;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      this.pagination.page = page;
      this.loading = false;
      return [];
    },
  },
});
