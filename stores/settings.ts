import { useMessage } from 'naive-ui';
import { defineStore } from 'pinia';

const dataStore = useDataStore();

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    apiKeys: [] as Array<ApiKeyInterface>,
    users: [] as Array<ProjectUserInterface>,
  }),
  getters: {
    hasApiKeys(state) {
      return Array.isArray(state.apiKeys) && state.apiKeys.length > 0;
    },
    hasUsers(state) {
      return Array.isArray(state.users) && state.users.length > 0;
    },
  },
  actions: {
    getApiKeyById(id: number) {
      return this.apiKeys.find(item => item.id === id) || ({} as ApiKeyInterface);
    },

    /**
     *
     * $i18n API calls
     */

    /** API keys */
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

    /** Users */
    async fetchProjectUsers($i18n?: any) {
      try {
        const res = await $api.get<ProjectUsersResponse>(
          endpoints.projectUsers(dataStore.currentProjectId)
        );
        this.users = res.data.items;
      } catch (error) {
        this.users = [];

        /** Show error message */
        const message = useMessage();
        message.error(userFriendlyMsg(error, $i18n));
      }
    },
  },
});
