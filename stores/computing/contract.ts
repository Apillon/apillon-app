import { defineStore } from 'pinia';
import { EncryptTab } from '~/lib/types/computing';

export const useContractStore = defineStore('contract', {
  state: () => ({
    active: {} as ContractInterface,
    archive: [] as ContractInterface[],
    archiveTotal: 0,
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
    hasContractArchive(state): boolean {
      return Array.isArray(state.archive) && state.archive.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as ContractInterface;
      this.archive = [] as ContractInterface[];
      this.archiveTotal = 0;
      this.items = [] as ContractInterface[];
      this.search = '';
      this.total = 0;
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

    async getContractArchive(): Promise<ContractInterface[]> {
      if (!this.hasContractArchive || isCacheExpired(LsCacheKeys.CONTRACT_ARCHIVE)) {
        return await this.fetchContracts(true);
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
    async fetchContracts(archive: boolean = false, showLoader: boolean = true): Promise<ContractInterface[]> {
      const dataStore = useDataStore();
      if (!dataStore.projectUuid) return [];

      this.loading = showLoader;
      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
          orderBy: 'createTime',
          desc: 'true',
          ...PARAMS_ALL_ITEMS,
        };
        if (archive) {
          params.status = SqlModelStatus.ARCHIVED;
        }

        const req = $api.get<ContractsResponse>(endpoints.contracts(), params);
        dataStore.promises.contracts = req;
        const res = await req;

        if (archive) {
          this.archive = res.data.items;
          this.archiveTotal = res.data.total;
        } else {
          this.items = res.data.items;
          this.total = res.data.total;
        }
        this.search = '';
        this.loading = false;

        /** Save timestamp to SS */
        const key = archive ? LsCacheKeys.CONTRACT_ARCHIVE : LsCacheKeys.CONTRACT;
        sessionStorage.setItem(key, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        /** Clear promise */
        dataStore.promises.contracts = null;

        if (archive) {
          this.archive = [] as Array<ContractInterface>;
          this.archiveTotal = 0;
        } else {
          this.items = [] as Array<ContractInterface>;
          this.total = 0;
        }

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
      } catch (e: ApiError | any) {
        console.error(e);
        this.active = {} as ContractInterface;
      }
      return {} as ContractInterface;
    },
  },
});
