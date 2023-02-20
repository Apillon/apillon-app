import { defineStore } from 'pinia';

export const useIpnsStore = defineStore('ipns', {
  state: () => ({
    items: [] as Array<IpnsInterface>,
    loading: false,
    search: '',
    total: 0,
  }),
  getters: {
    hasIpns(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },
  actions: {
    resetData() {
      /** Ipns */
      this.items = [] as Array<IpnsInterface>;
      this.search = '';
      this.total = 0;
    },

    /**
     * Fetch wrappers
     */
    async getIPNSs(bucketId: number): Promise<IpnsInterface[]> {
      if (!this.hasIpns || isCacheExpired(LsCacheKeys.IPNS)) {
        return await this.fetchIpns(bucketId);
      }
      return this.items;
    },

    async getIpnsById(bucketId: number, ipnsId: number): Promise<IpnsInterface | undefined> {
      const IPNSs = await this.getIPNSs(bucketId);
      return IPNSs.find(item => item.id === ipnsId);
    },

    /**
     * API calls
     */
    async fetchIpns(bucketId: number): Promise<IpnsInterface[]> {
      this.loading = true;

      try {
        const res = await $api.get<IpnsResponse>(endpoints.ipns(bucketId), PARAMS_ALL_ITEMS);

        this.items = res.data.items;
        this.total = res.data.total;
        this.loading = false;
        this.search = '';

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.IPNS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.items = [] as Array<IpnsInterface>;
        this.total = 0;

        this.loading = false;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return [];
    },
  },
});
