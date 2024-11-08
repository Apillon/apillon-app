import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    apiKeys: [] as ApiKeyInterface[],
    discordLink: '' as string,
    oauthLinks: [] as OauthLinkInterface[],
    users: [] as ProjectUserInterface[],
  }),
  getters: {
    currentUser(state) {
      if (Array.isArray(state.users) && state.users.length > 0) {
        const authStore = useAuthStore();
        return state.users.find(user => user.user_id === authStore.userId);
      }
      return {} as ProjectUserInterface;
    },
    hasApiKeys(state) {
      return Array.isArray(state.apiKeys) && state.apiKeys.length > 0;
    },
    hasUsers(state) {
      return Array.isArray(state.users) && state.users.length > 0;
    },
    hasOauthLinks(state) {
      return Array.isArray(state.oauthLinks) && state.oauthLinks.length > 0;
    },
  },
  actions: {
    resetData() {
      this.apiKeys = [] as ApiKeyInterface[];
      this.users = [] as ProjectUserInterface[];
    },

    getApiKeyById(id: number) {
      return this.apiKeys.find(item => item.id === id) || ({} as ApiKeyInterface);
    },

    /**
     * Fetch wrappers
     */

    /** API Keys */
    async getApiKeys() {
      if (!this.hasApiKeys || isCacheExpired(LsCacheKeys.API_KEYS)) {
        await this.fetchApiKeys();
      }
    },

    /** Oauth Links */
    async getOauthLinks(): Promise<any> {
      if (!this.hasOauthLinks || isCacheExpired(LsCacheKeys.OAUTH_LINKS)) {
        await this.fetchOauthLinks();
      }
      return this.oauthLinks;
    },

    /** Discord */
    async getDiscordLink(): Promise<string> {
      if (!this.discordLink || isCacheExpired(LsCacheKeys.DISCORD_LINK)) {
        await this.fetchDiscordLink();
      }
      return this.discordLink;
    },

    /**
     *
     * API calls
     */

    /** API Keys */
    async fetchApiKeys() {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        this.apiKeys = [] as ApiKeyInterface[];
      }

      try {
        const res = await $api.get<ApiKeysResponse>(endpoints.apiKey(), {
          project_uuid: dataStore.projectUuid,
        });
        this.apiKeys = res.data.items;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.API_KEYS, Date.now().toString());
      } catch (error: any) {
        this.apiKeys = [] as ApiKeyInterface[];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** Users */
    async fetchProjectUsers() {
      const dataStore = useDataStore();
      try {
        const res = await $api.get<ProjectUsersResponse>(
          endpoints.projectUsers(dataStore.project.selected)
        );
        this.users = res.data.items;
      } catch (error) {
        this.users = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** Oauth Links */
    async fetchOauthLinks(): Promise<any> {
      try {
        const res = await $api.get<OauthLinksResponse>(endpoints.oauthLinks);
        this.oauthLinks = res.data.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.OAUTH_LINKS, Date.now().toString());
      } catch (error) {
        this.oauthLinks = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return this.oauthLinks;
    },

    /** Discord */
    async fetchDiscordLink(): Promise<string> {
      try {
        const res = await $api.get<DiscordLinkResponse>(endpoints.discordLink);
        this.discordLink = res.data.url;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.DISCORD_LINK, Date.now().toString());
      } catch (error) {
        this.discordLink = '';

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return this.discordLink;
    },
  },
});
