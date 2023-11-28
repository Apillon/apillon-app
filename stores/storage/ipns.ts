import { defineStore } from 'pinia';

export const useIpnsStore = defineStore('ipns', {
  state: () => ({
    active: {} as IpnsInterface,
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
    async getIPNSs(bucketUuid: string): Promise<IpnsInterface[]> {
      if (!this.hasIpns || isCacheExpired(LsCacheKeys.IPNS)) {
        return await this.fetchIpns(bucketUuid);
      }
      return this.items;
    },

    async getIpnsFromList(
      bucketUuid: string,
      ipnsUuid: string
    ): Promise<IpnsInterface | undefined> {
      const IPNSs = await this.getIPNSs(bucketUuid);
      return IPNSs.find(item => item.ipns_uuid === ipnsUuid);
    },

    async getIpnsById(bucketUuid: string, ipnsUuid: string): Promise<IpnsInterface> {
      if (this.active.ipns_uuid !== ipnsUuid || isCacheExpired(LsCacheKeys.IPNS_ITEM)) {
        return await this.fetchIpnsById(bucketUuid, ipnsUuid);
      }
      return this.active;
    },

    /**
     * API calls
     */
    async fetchIpns(bucketUuid: string): Promise<IpnsInterface[]> {
      this.loading = true;

      try {
        const res = await $api.get<IpnsResponse>(endpoints.ipns(bucketUuid), PARAMS_ALL_ITEMS);

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

    async fetchIpnsById(bucketUuid: string, ipnsUuid: string): Promise<IpnsInterface> {
      try {
        const res = await $api.get<IpnsItemResponse>(endpoints.ipns(bucketUuid, ipnsUuid));

        this.active = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.IPNS_ITEM, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as IpnsInterface;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as IpnsInterface;
    },
  },
});
