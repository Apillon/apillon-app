import { defineStore } from 'pinia';
export type AssetInterface = Record<string, number>;
type AssetResponse = GeneralResponse<AssetInterface>;
type AssetsResponse = GeneralItemsResponse<AssetInterface>;

export const useAssetHubStore = defineStore('assetHub', {
  state: () => ({
    active: {} as AssetInterface,
    items: [] as AssetInterface[],
    loading: false,
    search: '',
    pagination: createPagination(),
  }),
  getters: {
    hasAssets(state): boolean {
      return (
        !!state.search || state.loading || (Array.isArray(state.items) && state.items.length > 0)
      );
    },
  },
  actions: {
    resetData() {
      this.items = [] as AssetInterface[];
      this.pagination.page = 1;
      this.pagination.itemCount = 0;
      this.search = '';
    },

    /**
     * Fetch wrappers
     */
    async getAssets(page = 1): Promise<AssetInterface[]> {
      if (page !== this.pagination.page || !this.hasAssets || isCacheExpired(LsCacheKeys.ASSETS)) {
        return await this.fetchAssets(page);
      }
      return this.items;
    },

    async getAsset(uuid: string): Promise<AssetInterface> {
      if (this.active?.uuid === uuid && !isCacheExpired(LsCacheKeys.ASSET)) {
        return this.active;
      }
      return await this.fetchAsset(uuid);
    },

    /**
     * API calls
     */
    async fetchAssets(page?: number, showLoader: boolean = true): Promise<AssetInterface[]> {
      this.loading = showLoader;

      try {
        const dataStore = useDataStore();
        const params = parseArguments({
          limit: this.pagination.pageSize,
          page: page,
          search: this.search,
          project_uuid: dataStore.projectUuid,
        });

        const res = await $api.get<AssetsResponse>(endpoints.assets(), params);

        this.items = res.data.items;
        this.pagination.itemCount = res.data.total;
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.ASSETS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.items = [] as Array<AssetInterface>;
        this.pagination.itemCount = 0;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      this.loading = false;
      return [];
    },

    async fetchAsset(uuid: string): Promise<AssetInterface> {
      try {
        const res = await $api.get<AssetResponse>(endpoints.assets(uuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.ASSET, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as AssetInterface;
      }
      return {} as AssetInterface;
    },
  },
});
