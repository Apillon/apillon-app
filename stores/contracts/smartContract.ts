import { defineStore } from 'pinia';

export const useSmartContractStore = defineStore('smartContract', {
  state: () => ({
    active: {} as SmartContractInterface,
    items: [] as SmartContractInterface[],
    loading: false,
  }),
  getters: {
    hasSmartContracts(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },
  actions: {
    /**
     * Fetch wrappers
     */
    async getSmartContracts() {
      if (this.hasSmartContracts && !isCacheExpired(LsCacheKeys.SMART_CONTRACTS)) {
        return this.items;
      }
      return await this.fetchSmartContracts();
    },

    async getSmartContract(contractUuid: string) {
      if (this.active?.contract_uuid === contractUuid && !isCacheExpired(LsCacheKeys.SMART_CONTRACT)) {
        return this.active;
      }
      return await this.fetchSmartContract(contractUuid);
    },

    /**
     * API calls
     */
    async fetchSmartContracts(showLoader: boolean = true) {
      this.loading = showLoader;
      try {
        const res = await $api.get<SmartContractsResponse>(endpoints.smartContracts(), PARAMS_ALL_ITEMS);
        this.items = res.data.items;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SMART_CONTRACTS, Date.now().toString());
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
    },

    async fetchSmartContract(contractUUID: string, showLoader: boolean = true) {
      this.loading = showLoader;
      try {
        const res = await $api.get<SmartContractResponse>(endpoints.smartContracts(contractUUID));
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SMART_CONTRACTS, Date.now().toString());

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
