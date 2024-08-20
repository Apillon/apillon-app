import { defineStore } from 'pinia';

export const useSmartContractsStore = defineStore('contracts', {
  state: () => ({
    active: {} as SmartContractInterface,
    smartContracts: [] as SmartContractInterface[],
    smartContractDetails: {} as SmartContractInterface,
    smartContractsPerProject: {} as SmartContractInterface,
    loading: false,
    search: '',
    deployedSmartContractDetails: {} as SmartContractInterface,
    pagination: createPagination(),
  }),
  getters: {
    getAllContracts(state): SmartContractInterface[] {
      return state.smartContracts;
    },
    getContractDetails(state): SmartContractInterface {
      return state.smartContractDetails;
    },
    getContractsPerProject(state): SmartContractInterface {
      return state.smartContractsPerProject;
    },
  },
  actions: {
    /**
     * Fetch wrappers
     */
    async getContracts() {
      await this.getAllContractList();
    },

    async getDeployedSmartContract(contractUuid: string) {
      if (
        this.active?.contract_uuid === contractUuid &&
        !isCacheExpired(LsCacheKeys.DEPLOYED_SMART_CONTRACT)
      ) {
        return this.active;
      }
      return await this.fetchDeployedSmartContractDetails(contractUuid);
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
        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SMART_CONTRACTS, Date.now().toString());
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
    },

    async fetchContractsPerProject(projectUUID: string | undefined, showLoader: boolean = false) {
      this.loading = showLoader;
      try {
        const res = await $api.get(endpoints.smartContractsPerProject(projectUUID));
        this.smartContractsPerProject = res.data;
        sessionStorage.setItem(LsCacheKeys.SMART_CONTRACTS_PROJECTS, Date.now().toString());
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
    },

    async fetchDeployedSmartContractDetails(contractUuid: string | undefined) {
      try {
        const res = await $api.get(endpoints.deployedSmartContractDetails(contractUuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.DEPLOYED_SMART_CONTRACT, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as SmartContractInterface;
        /** Show error message */
      }
      return {} as SmartContractInterface;
    },
  },
});
