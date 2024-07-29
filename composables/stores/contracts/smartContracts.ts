import { defineStore } from 'pinia';

export const useSmartContractsStore = defineStore('contracts', {
  state: () => ({
    smartContracts: [] as SmartContractInterface[],
    smartContractDetails: {} as SmartContractInterface,
    loading: false,
  }),
  getters: {
    getAllContracts(state): SmartContractInterface[] {
      return state.smartContracts;
    },
    getContractDetails(state): SmartContractInterface {
      return state.smartContractDetails;
    },
  },
  actions: {
    /**
     * Fetch wrappers
     */
    async getContracts() {
      await this.getAllContractList();
    },

    /**
     * API calls
     */
    async getAllContractList(showLoader: boolean = true) {
      this.loading = showLoader;
      try {
        const res = await $api.get<ContractsResponse>(endpoints.smartContractsList());
        // TODO type
        this.smartContracts = res.data.items;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SMART_CONTRACTS, Date.now().toString());
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
    },

    async getContractByUUID(contractUUID: string, showLoader: boolean = true) {
      this.loading = showLoader;
      try {
        const res = await $api.get(endpoints.smartContractDetails(contractUUID));
        console.log(res);
        // TODO type
        this.smartContractDetails = res.data;
        console.log(res.data);
        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SMART_CONTRACTS, Date.now().toString());
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
    },
  },
});
