import { defineStore } from 'pinia';

export const useEwApiKeyStore = defineStore('key', {
  state: () => ({
    items: [] as EwApiKeyInterface[],
    loading: false,

    pagination: {
      page: 1,
      pageSize: PAGINATION_LIMIT,
      itemCount: 0,
    },
  }),
  getters: {
    hasEwKeys(state): boolean {},
  },
  actions: {
    /**
     * Fetch wrappers
     */
    async getKeys(): Promise<EwApiKeyInterface[]> {
      await this.fetchEwKeys();
    },
    /**
     * API calls
     */
    async fetchEwKeys(showLoader: boolean = true) {
      this.loading = showLoader;
    },
  },
});
