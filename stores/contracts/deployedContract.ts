import { defineStore } from 'pinia';

export const useDeployedContractStore = defineStore('deployedContract', {
  state: () => ({
    active: {} as DeployedContractDetailsInterface,
    items: [] as DeployedContractInterface[],
    loading: false,
    pagination: createPagination(),
    search: '',
    archive: {
      items: [] as DeployedContractInterface[],
      loading: false,
      search: '',
      pagination: createPagination(),
    },
  }),
  getters: {
    hasDeployedContracts(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    showDeployedContracts(state): boolean {
      return state.loading || !!state.search || (Array.isArray(state.items) && state.items.length > 0);
    },
    hasDeployedContractsArchive(state): boolean {
      return Array.isArray(state.archive.items) && state.archive.items.length > 0;
    },
    showDeployedContractsArchive(state): boolean {
      return (
        state.archive.loading ||
        !!state.archive.search ||
        (Array.isArray(state.archive.items) && state.archive.items.length > 0)
      );
    },
  },
  actions: {
    resetData() {
      this.active = {} as DeployedContractDetailsInterface;
      this.items = [] as DeployedContractInterface[];
      this.search = '';
      this.archive.items = [] as DeployedContractInterface[];
      this.archive.pagination.page = 1;
      this.archive.pagination.itemCount = 0;
      this.archive.search = '';
    },
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
    async getDeployedContractsArchive(page = 1, limit = PAGINATION_LIMIT) {
      if (
        page !== this.archive.pagination.page ||
        !this.hasPostArchive ||
        isCacheExpired(LsCacheKeys.SMART_CONTRACTS_DEPLOYED_ARCHIVED)
      ) {
        return await this.fetchDeployedContractsArchive(page, limit);
      }
      return this.items;
    },

    async getDeployedContract(contractUuid: string) {
      if (this.active?.contract_uuid === contractUuid && !isCacheExpired(LsCacheKeys.SMART_CONTRACT_DEPLOYED)) {
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
        const res = await $api.get<DeployedContractsResponse>(endpoints.smartContractsDeployed(), params);
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

    async fetchDeployedContractsArchive(
      page = 1,
      limit = PAGINATION_LIMIT,
      showLoader: boolean = true
    ): Promise<DeployedContractInterface[]> {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      this.archive.loading = showLoader;
      try {
        const params = parseArguments({
          limit,
          page,
          search: this.search,
          project_uuid: dataStore.projectUuid,
          status: SqlModelStatus.ARCHIVED,
        });
        const res = await $api.get<DeployedContractsResponse>(endpoints.smartContractsDeployed(), params);
        this.archive.items = res.data.items;
        this.archive.pagination.itemCount = res.data.total;

        sessionStorage.setItem(LsCacheKeys.SMART_CONTRACTS_DEPLOYED_ARCHIVED, Date.now().toString());
      } catch (error: any) {
        this.archive.items = [];
        this.archive.pagination.itemCount = 0;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.archive.loading = false;
      }
      return this.archive.items;
    },

    async fetchDeployedContract(contractUuid: string | undefined) {
      if (!contractUuid) return;

      try {
        const res = await $api.get<DeployedContractResponse>(endpoints.smartContractsDeployed(contractUuid));
        this.active = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SMART_CONTRACT_DEPLOYED, Date.now().toString());

        return res.data;
      } catch (error: any) {
        // this.active = {} as DeployedContractInterface;
        /** Show error message */
      }
      return {} as DeployedContractDetailsInterface;
    },
  },
});
