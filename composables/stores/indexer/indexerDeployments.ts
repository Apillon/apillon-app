import { defineStore } from 'pinia';

export const useIndexerDeploymentsStore = defineStore('indexerDeployments', {
  state: () => ({
    active: {} as IndexerDeploymentInterface,
    indexerUuid: '',
    items: [] as IndexerDeploymentInterface[],
    loading: false,
  }),
  actions: {
    /**
     * Fetch wrappers
     */
    async getDeployments(indexerUuid: string) {
      if (this.indexerUuid === indexerUuid && !isCacheExpired(LsCacheKeys.INDEXER_DEPLOYMENTS)) {
        return this.items;
      }
      return await this.fetchDeployments(indexerUuid);
    },

    /**
     * API calls
     */
    async fetchDeployments(indexerUuid: string, showLoader: boolean = true) {
      this.loading = showLoader;
      this.indexerUuid = indexerUuid;
      try {
        const res = await $api.get<IndexerDeploymentsResponse>(
          endpoints.indexerDeployments(this.indexerUuid)
        );
        this.items = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.INDEXER_DEPLOYMENTS, Date.now().toString());
      } catch (error: any) {
        this.items = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
      return this.items;
    },
  },
});
