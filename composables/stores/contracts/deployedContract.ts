import { defineStore } from 'pinia';

export const useDeployedContractStore = defineStore('deployedContract', {
  state: () => ({
    active: {} as DeployedContractInterface,
    items: [] as DeployedContractInterface[],
    loading: false,
    pagination: createPagination(),
    search: '',
  }),
  getters: {
    hasDeployedContracts(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },
  actions: {
    /**
     * Fetch wrappers
     */
    async getDeployedContracts(page = 1, limit = PAGINATION_LIMIT) {
      if (
        page === this.pagination.page &&
        this.hasDeployedContracts &&
        !isCacheExpired(LsCacheKeys.SMART_CONTRACTS_DEPLOYED)
      ) {
        return this.items;
      }
      return await this.fetchDeployedContracts(page, limit);
    },

    async getDeployedContract(contractUuid: string) {
      if (
        this.active?.contract_uuid === contractUuid &&
        !isCacheExpired(LsCacheKeys.SMART_CONTRACT_DEPLOYED)
      ) {
        return this.active;
      }
      return await this.fetchDeployedContract(contractUuid);
    },

    /**
     * API calls
     */

    async fetchDeployedContracts(
      page = 1,
      limit = PAGINATION_LIMIT,
      showLoader: boolean = true
    ): Promise<DeployedContractInterface[]> {
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
        const res = await $api.get<DeployedContractsResponse>(
          endpoints.smartContractsDeployed(),
          params
        );
        this.items = res.data.items;
        this.pagination.itemCount = res.data.total;

        sessionStorage.setItem(LsCacheKeys.SMART_CONTRACTS_DEPLOYED, Date.now().toString());
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

    async fetchDeployedContract(contractUuid: string | undefined) {
      if (!contractUuid) return;

      try {
        const res = await $api.get<DeployedContractResponse>(
          endpoints.smartContractsDeployed(contractUuid)
        );
        this.active = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SMART_CONTRACT_DEPLOYED, Date.now().toString());

        return res.data;
      } catch (error: any) {
        // this.active = {} as DeployedContractInterface;
        /** Show error message */
      }
      return {} as DeployedContractInterface;
    },
  },
});
