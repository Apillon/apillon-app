import { defineStore } from 'pinia';
import { EncryptTab } from '~/lib/types/computing';

export const useContractStore = defineStore('contract', {
  state: () => ({
    active: {} as ContractInterface,
    bucketUuid: '',
    encryptTab: EncryptTab.BUCKET,
    items: [] as ContractInterface[],
    loading: false,
    search: '',
    total: 0,
    form: {
      name: '',
      description: '',
      contractType: ComputingContractType.SCHRODINGER,
      bucket_uuid: null,
      contractData: {
        nftContractAddress: '',
        nftChain: 0,
        nftChainRpcUrl: '',
        restrictToOwner: false,
      },
    },
  }),
  getters: {
    hasContracts(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as ContractInterface;
      this.items = [] as ContractInterface[];
      this.search = '';
    },

    /**
     * Fetch wrappers
     */
    async getContracts(): Promise<ContractInterface[]> {
      if (!this.hasContracts || isCacheExpired(LsCacheKeys.CONTRACTS)) {
        return await this.fetchContracts();
      }
      return this.items;
    },

    async getContract(contractUuid: string): Promise<ContractInterface> {
      if (this.active?.contract_uuid === contractUuid && !isCacheExpired(LsCacheKeys.CONTRACT)) {
        return this.active;
      }
      return await this.fetchContract(contractUuid);
    },

    /**
     * API calls
     */
    async fetchContracts(showLoader: boolean = true): Promise<ContractInterface[]> {
      this.loading = showLoader;

      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
          orderBy: 'createTime',
          desc: 'true',
          ...PARAMS_ALL_ITEMS,
        };

        const req = $api.get<ContractsResponse>(endpoints.contracts(), params);
        dataStore.promises.contracts = req;
        const res = await req;

        this.items = res.data.items;
        this.total = res.data.total;
        this.search = '';
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CONTRACTS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        /** Clear promise */
        dataStore.promises.contracts = null;
        this.items = [] as Array<ContractInterface>;
        this.total = 0;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      this.loading = false;
      return [];
    },

    async fetchContract(uuid: string): Promise<ContractInterface> {
      try {
        const res = await $api.get<ContractResponse>(endpoints.contracts(uuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CONTRACT, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as ContractInterface;
      }
      return {} as ContractInterface;
    },
  },
});
