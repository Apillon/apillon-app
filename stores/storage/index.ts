import { defineStore } from 'pinia';

export const useStorageStore = defineStore('storage', {
  state: () => ({
    info: {} as StorageInfoInterface,
    loading: false,
  }),
  getters: {
    hasInfo(state): boolean {
      return state.info && state.info?.availableStorage > 0;
    },
  },
  actions: {
    resetData() {
      this.info = {} as StorageInfoInterface;
    },

    /**
     * Fetch wrappers
     */
    async getStorageInfo() {
      if (!this.hasInfo || isCacheExpired(LsCacheKeys.STORAGE_INFO)) {
        await this.fetchStorageInfo();
      }
    },

    /**
     * API calls
     */
    async fetchStorageInfo() {
      const dataStore = useDataStore();
      if (!dataStore.projectUuid) return;

      this.loading = true;
      try {
        const res = await $api.get<StorageInfoResponse>(endpoints.storageInfo, {
          project_uuid: dataStore.projectUuid,
        });
        this.info = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.STORAGE_INFO, Date.now().toString());
      } catch (error: any) {
        this.info = {} as StorageInfoInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
    },
  },
});
