import { useMessage } from 'naive-ui';
import { defineStore } from 'pinia';

const dataStore = useDataStore();

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    apiKeys: [] as Array<ApiKeyInterface>,
  }),
  getters: {},
  actions: {
    async fetchApiKeys($i18n?: any) {
      if (!dataStore.hasProjects) {
        this.apiKeys = [] as Array<ApiKeyInterface>;
        alert('Please create project first');
      }

      try {
        const res = await $api.get<ApiKeysResponse>(endpoints.apiKey, {
          project_uuid: dataStore.currentProject?.project_uuid || '',
        });

        this.apiKeys = res.data.items;
      } catch (error: any) {
        this.apiKeys = [] as Array<ApiKeyInterface>;

        /** Show error message */
        const message = useMessage();
        message.error(userFriendlyMsg(error, $i18n));
      }
    },
  },
});
