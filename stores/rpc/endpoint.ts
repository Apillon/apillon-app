export const useRpcEndpointStore = defineStore('endpoint', {
  state: () => ({
    items: [] as RpcEndpointInterface[],
    publicEndpointsSearch: '',
    publicEndpoints: [] as RpcEndpointInterface[],
    loading: false,
    search: '',
    total: 0,
  }),

  getters: {
    hasEndpoints(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasPublicEndpoints(state): boolean {
      return Array.isArray(state.publicEndpoints) && state.publicEndpoints.length > 0;
    },
    hasFavorites(state): boolean {
      return state.items.some(item => item.isFavorite);
    },
  },

  actions: {
    reset(): void {
      this.items = [];
      this.search = '';
      this.total = 0;
    },

    async getEndpoints(): Promise<RpcEndpointInterface[]> {
      if (!this.hasEndpoints || isCacheExpired(LsCacheKeys.RPC_ENDPOINTS)) {
        await this.fetchEndpoints();
      }

      return this.items;
    },

    async getPublicEndpoints(): Promise<RpcEndpointInterface[]> {
      if (!this.hasPublicEndpoints || isCacheExpired(LsCacheKeys.RPC_PUBLIC_ENDPOINTS)) {
        return await this.fetchPublicEndpoints();
      }

      return this.publicEndpoints;
    },

    async fetchEndpoints(showLoader = true): Promise<RpcEndpointInterface[]> {
      this.loading = showLoader;

      const rpcApiKeyStore = useRpcApiKeyStore();

      const apiKeyId = rpcApiKeyStore.selectedId;

      if (!apiKeyId) {
        this.loading = false;
        return [];
      }

      const dataStore = useDataStore();

      try {
        const req = Promise.all([
          $api.get<RpcEndpointsResponse>(endpoints.rpcEndpoints()),
          $api.get<RpcFavoriteEndpointsResponse>(endpoints.rpcFavoriteEndpoints(apiKeyId)),
        ]);
        dataStore.promises.rpcEndpoints = req;
        const [allEndpoints, favorites] = await req;

        const items = allEndpoints.data.map(item => {
          const favorite = favorites.data.items.find(
            favorite => favorite.chainName === item.name && favorite.network === item.networkName
          );

          return {
            ...item,
            favoriteData: favorite,
            isFavorite: !!favorite,
          };
        });

        this.items = items;
        this.total = allEndpoints.data.length;
        this.search = '';
        this.loading = false;

        const key = LsCacheKeys.RPC_ENDPOINTS;
        sessionStorage.setItem(key, Date.now().toString());

        return items;
      } catch (e: ApiError | any) {
        console.error(e);
        dataStore.promises.rpcEndpoints = null;

        this.items = [] as Array<RpcEndpointInterface>;
        this.total = 0;
      }

      this.loading = false;
      return [];
    },

    async fetchPublicEndpoints(showLoader = true): Promise<RpcEndpointInterface[]> {
      this.loading = showLoader;

      const dataStore = useDataStore();

      try {
        const req = $api.get<RpcEndpointsResponse>(endpoints.rpcEndpoints());
        dataStore.promises.publicRpcEndpoints = req;
        const res = await req;

        const items = res.data.map(item => ({
          ...item,
          chainName: item.name,
          networkName: item.networkName,
        }));

        this.publicEndpoints = items;
        this.total = res.data.length;
        this.search = '';
        this.loading = false;

        const key = LsCacheKeys.RPC_PUBLIC_ENDPOINTS;
        sessionStorage.setItem(key, Date.now().toString());

        return res.data;
      } catch (e: ApiError | any) {
        console.error(e);
        dataStore.promises.rpcEndpoints = null;

        this.publicEndpoints = [] as Array<RpcEndpointInterface>;
        this.total = 0;
      }

      this.loading = false;
      return [];
    },
  },
});
