export const useRpcApiKeyStore = defineStore('rpc-api-key', {
  state: () => ({
    search: '',
    loading: false,
    total: 0,
    usage: undefined as RpcApiKeyUsageInterface | undefined,
    selectedId: undefined as number | undefined,
    items: [] as RpcApiKeyInterface[],
    form: {
      name: '',
      description: '',
      project_uuid: undefined as string | undefined,
    },
    dwellirId: null as string | null,
    quotaReached: undefined as Boolean | undefined,
  }),
  getters: {
    hasRpcApiKeys(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },

  actions: {
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

    async fetchRpcApiKeyUsage(showLoader: boolean = true) {
      this.loading = showLoader;
      const dataStore = useDataStore();

      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      if (this.selectedId) {
        try {
          const res = await $api.get<RpcApiKeyUsageResponse>(
            endpoints.rpcApiKeyUsage(dataStore.projectUuid, this.selectedId)
          );
          this.usage = res.data;
        } catch (error) {}
      }
      this.loading = false;
    },

    async fetchApiKeyQuota() {
      try {
        const res = await $api.get<RpcApiKeysQuotaResponse>(endpoints.rpcApiKeysQuotaReached());
        this.quotaReached = res.data;
      } catch (error) {
        this.quotaReached = undefined;
        window.$message.error(userFriendlyMsg(error));
      }
    },
    async fetchApiKeys(showLoader: boolean = true): Promise<RpcApiKeyInterface[]> {
      this.loading = showLoader;

      const dataStore = useDataStore();

      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

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

        const key = LsCacheKeys.RPC_API_KEYS;
        sessionStorage.setItem(key, Date.now().toString());

        return res.data.items;
      } catch (error) {
        dataStore.promises.rpcApiKeys = null;

        this.items = [] as Array<RpcApiKeyInterface>;
        this.total = 0;
      }

      this.loading = false;
      return [];
    },
  },
});
