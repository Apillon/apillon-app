import { defineStore } from 'pinia';

const authStore = useAuthStore();
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
    currentUser(state) {
      if (this.hasUsers) {
        return state.users.find(user => user.user_id === authStore.userId);
      }
      return {} as ProjectUserInterface;
    },
  },
  actions: {
    getApiKeyById(id: number) {
      return this.apiKeys.find(item => item.id === id) || ({} as ApiKeyInterface);
    },

    isUser(type: number): boolean {
      return dataStore.myRoleOnProject === type;
    },
    isUserOwner(): boolean {
      return dataStore.myRoleOnProject === DefaultUserRole.PROJECT_OWNER;
    },
    isUserAdmin(): boolean {
      return dataStore.myRoleOnProject === DefaultUserRole.PROJECT_ADMIN;
    },
    isProjectUser(): boolean {
      return dataStore.myRoleOnProject === DefaultUserRole.PROJECT_USER;
    },

    /**
     *
     * API calls
     */

    /** API keys */
    async fetchApiKeys() {
      if (!dataStore.hasProjects) {
        this.apiKeys = [] as Array<ApiKeyInterface>;
        alert('Please create project first');
      }

      try {
        const res = await $api.get<ApiKeysResponse>(endpoints.apiKey(), {
          project_uuid: dataStore.projectUuid,
        });

        this.apiKeys = res.data.items;
      } catch (error: any) {
        this.apiKeys = [] as Array<ApiKeyInterface>;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** Users */
    async fetchProjectUsers() {
      try {
        const res = await $api.get<ProjectUsersResponse>(
          endpoints.projectUsers(dataStore.currentProjectId)
        );
        this.users = res.data.items;
      } catch (error) {
        this.users = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },
  },
});
