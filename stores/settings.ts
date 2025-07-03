import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    apiKeys: [] as ApiKeyInterface[],
    discordLink: '' as string,
    oauthLinks: [] as OauthLinkInterface[],
    users: [] as ProjectUserInterface[],
    youtubeChapters: {} as Record<string, VideoChapter[]>,
    notifications: {
      loading: false,
      showOnlyUnread: false,
      items: [] as NotificationInterface[],
      read: [] as number[],
    },
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
    hasNotifications(state) {
      return Array.isArray(state.notifications.items) && state.notifications.items.length > 0;
    },
    hasUsers(state) {
      return Array.isArray(state.users) && state.users.length > 0;
    },
    hasOauthLinks(state) {
      return Array.isArray(state.oauthLinks) && state.oauthLinks.length > 0;
    },
    unreadNotifications(state) {
      return state.notifications.items.filter(n => !this.notifications.read.includes(n.id)) || [];
    },
    notificationsToShow(state) {
      if (state.notifications.showOnlyUnread) {
        return state.notifications.items.filter(n => !this.notifications.read.includes(n.id)) || [];
      }
      return state.notifications.items;
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

    /** Notification actions */
    readNotification(id: number) {
      if (!this.notifications.read.includes(id)) {
        this.notifications.read.push(id);
      }
    },

    readAllNotifications() {
      this.notifications.items.forEach(n => this.readNotification(n.id));
    },

    getYouTubeChapters(videoId: string) {
      return videoId in this.youtubeChapters ? this.youtubeChapters[videoId] : null;
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

    /** Notifications */
    async getNotifications(): Promise<NotificationInterface[]> {
      if (!this.hasNotifications || isCacheExpired(LsCacheKeys.NOTIFICATIONS)) {
        await this.fetchNotifications();
      }
      return this.notifications.items;
    },

    /**
     *
     * API calls
     */

    /** API Keys */
    async fetchApiKeys() {
      const dataStore = useDataStore();
      await dataStore.waitOnPromises(false);
      if (!dataStore.hasProjects) {
        this.apiKeys = [] as ApiKeyInterface[];
        return;
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
      await dataStore.waitOnPromises(false);
      if (!dataStore.projectUuid) return;
      try {
        const res = await $api.get<ProjectUsersResponse>(endpoints.projectUsers(dataStore.projectUuid));
        this.users = res.data.items;
      } catch (error: ApiError | any) {
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
      } catch (error: ApiError | any) {
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
      } catch (error: ApiError | any) {
        this.discordLink = '';

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return this.discordLink;
    },

    /** Notifications */
    async fetchNotifications() {
      this.notifications.loading = true;
      try {
        const params = parseArguments({ limit: PARAMS_ALL_ITEMS.limit });
        const { data } = await $api.get<NotificationsResponse>(endpoints.notification, params);
        this.notifications.items = data.items;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.NOTIFICATIONS, Date.now().toString());
      } catch (error: any) {
        this.notifications.items = [] as NotificationInterface[];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.notifications.loading = false;
      }
    },
  },
  persist: {
    key: SessionKeys.SETTINGS_STORE,
    storage: piniaPluginPersistedstate.localStorage(),
    pick: ['notifications', 'youtubeChapters'],
  },
});
