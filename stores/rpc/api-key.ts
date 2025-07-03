export const useRpcApiKeyStore = defineStore('rpc-api-key', {
  state: () => ({
    search: '',
    loading: false,
    total: 0,
    usage: undefined as RpcApiKeyUsageInterface | undefined,
    usagePerChain: undefined as RpcApiKeyUsagePerChainInterface | undefined,
    selectedId: undefined as number | undefined,
    items: [] as RpcApiKeyInterface[],
    form: {
      name: '',
      description: '',
      project_uuid: undefined as string | undefined,
    },
    dwellirId: null as string | null,
    quotaReached: undefined as boolean | undefined,
  }),
  getters: {
    hasRpcApiKeys(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },

  actions: {
    reset(): void {
      this.dwellirId = null;
      this.items = [];
      this.quotaReached = undefined;
      this.selectedId = undefined;
      this.search = '';
      this.total = 0;
    },

    deleteItem(id: number): void {
      this.items = this.items.filter(item => item.id !== id);
      if (this.selectedId === id) {
        this.selectedId = undefined;
        this.handleSelectedIdChange();
      }
    },

    handleSelectedIdChange(): void {
      this.usage = undefined;
      const rpcEndpointStore = useRpcEndpointStore();
      rpcEndpointStore.reset();
    },

    async getApiKeys(): Promise<RpcApiKeyInterface[]> {
      if (!this.hasRpcApiKeys || isCacheExpired(LsCacheKeys.RPC_API_KEYS)) {
        return await this.fetchApiKeys();
      }
      return this.items;
    },

    async getRpcApiKeyQuota() {
      if (this.quotaReached === undefined) {
        await this.fetchApiKeyQuota();
      }
    },

    async getRpcApiKeyUsage() {
      if (this.usage === undefined || isCacheExpired(LsCacheKeys.RPC_API_KEY_USAGE)) {
        await this.fetchRpcApiKeyUsage();
      }
      return this.usage;
    },

    async getRpcApiKeyUsagePerChain() {
      if (this.usagePerChain === undefined || isCacheExpired(LsCacheKeys.RPC_API_KEY_USAGE_PER_CHAIN)) {
        await this.fetchRpcApiKeyUsagePerChain();
      }
      return this.usagePerChain;
    },

    async fetchRpcApiKeyUsage(showLoader: boolean = true) {
      const dataStore = useDataStore();
      await dataStore.waitOnPromises(false);
      if (!dataStore.projectUuid) return;

      this.loading = showLoader;
      if (this.selectedId) {
        try {
          const res = await $api.get<RpcApiKeyUsageResponse>(
            endpoints.rpcApiKeyUsage(dataStore.projectUuid, this.selectedId)
          );
          this.usage = res.data;

          sessionStorage.setItem(LsCacheKeys.RPC_API_KEY_USAGE, Date.now().toString());
        } catch (e: ApiError | any) {
          console.error(e);
        }
      }
      this.loading = false;
    },

    async fetchRpcApiKeyUsagePerChain(showLoader: boolean = true) {
      const dataStore = useDataStore();
      await dataStore.waitOnPromises(false);
      if (!dataStore.projectUuid) return;

      this.loading = showLoader;
      if (this.selectedId) {
        try {
          const res = await $api.get<RpcApiKeyUsagePerChainResponse>(
            endpoints.rpcApiKeyUsagePerChain(dataStore.projectUuid, this.selectedId)
          );
          this.usagePerChain = res.data;

          sessionStorage.setItem(LsCacheKeys.RPC_API_KEY_USAGE_PER_CHAIN, Date.now().toString());
        } catch (e: ApiError | any) {
          console.error(e);
        }
      }
      this.loading = false;
    },

    async fetchApiKeyQuota() {
      const dataStore = useDataStore();
      await dataStore.waitOnPromises(false);
      if (!dataStore.projectUuid) return;
      try {
        const res = await $api.get<BooleanResponse>(endpoints.rpcApiKeysQuotaReached());
        this.quotaReached = res.data;
      } catch (error: ApiError | any) {
        this.quotaReached = undefined;
        window.$message.error(userFriendlyMsg(error));
      }
    },
    async fetchApiKeys(showLoader: boolean = true): Promise<RpcApiKeyInterface[]> {
      const dataStore = useDataStore();
      await dataStore.waitOnPromises(false);
      if (!dataStore.projectUuid) return [];

      this.loading = showLoader;
      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
          ...PARAMS_ALL_ITEMS,
        };

        const req = $api.get<RpcApiKeysResponse>(endpoints.rpcApiKeys(), params);
        dataStore.promises.rpcApiKeys = req;

        const res = await req;
        this.items = res.data.items;

        this.total = res.data.total;
        this.search = '';
        this.loading = false;

        sessionStorage.setItem(LsCacheKeys.RPC_API_KEYS, Date.now().toString());

        return res.data.items;
      } catch (e: ApiError | any) {
        console.error(e);
        dataStore.promises.rpcApiKeys = null;

        this.items = [] as Array<RpcApiKeyInterface>;
        this.total = 0;
      }

      this.loading = false;
      return [];
    },
  },
});
