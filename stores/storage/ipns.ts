import { defineStore } from 'pinia';

export const useIpnsStore = defineStore('ipns', {
  state: () => ({
    items: [] as Array<IpnsInterface>,
    loading: false,
    search: '',
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
    },

    /**
     * Fetch wrappers
     */
    async getIPNSs(bucketId: number) {
      if (!this.hasIpns || isCacheExpired(LsCacheKeys.IPNS)) {
        return await this.fetchIpns(bucketId);
      }
      return this.items;
    },

    /**
     * API calls
     */
    async fetchIpns(bucketId: number) {
      this.loading = true;

      try {
        const res = await $api.get<IpnsResponse>(endpoints.ipns(bucketId));

        this.items = res.data.items;
        this.loading = false;
        this.search = '';

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.IPNS, Date.now().toString());

        return res;
      } catch (error: any) {
        this.items = [] as Array<IpnsInterface>;

        this.loading = false;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },
  },
});
