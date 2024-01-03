import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', {
  state: () => ({
    activeSpace: {} as ChatInterface,
    spaces: [] as ChatInterface[],
    loading: false,
    search: '',
    settings: grillChatDefaultSettings,
    total: 0,
  }),
  getters: {
    hasChats(state): boolean {
      return Array.isArray(state.spaces) && state.spaces.length > 0;
    },
  },
  actions: {
    resetData() {
      this.activeSpace = {} as ChatInterface;
      this.spaces = [] as ChatInterface[];
      this.search = '';
    },

    /**
     * Fetch wrappers
     */
    async getSpaces(): Promise<ChatInterface[]> {
      if (!this.hasChats || isCacheExpired(LsCacheKeys.CHATS)) {
        return await this.fetchSpaces();
      }
      return this.spaces;
    },

    async getSpace(spaceUuid: string): Promise<ChatInterface> {
      if (this.activeSpace?.space_uuid === spaceUuid && !isCacheExpired(LsCacheKeys.CHAT)) {
        return this.activeSpace;
      }
      return await this.fetchSpace(spaceUuid);
    },

    /**
     * API calls
     */
    async fetchSpaces(showLoader: boolean = true): Promise<ChatInterface[]> {
      this.loading = showLoader;

      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();

      try {
        const params: Record<string, string | number> = {
          project_uuid: projectUuid,
          orderBy: 'createTime',
          desc: 'true',
          ...PARAMS_ALL_ITEMS,
        };

        const res = await $api.get<ChatsResponse>(endpoints.spaces(), params);

        this.spaces = res.data.items;
        this.total = res.data.total;
        this.search = '';
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COLLECTIONS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.spaces = [] as Array<ChatInterface>;
        this.total = 0;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      this.loading = false;
      return [];
    },

    async fetchSpace(uuid: string): Promise<ChatInterface> {
      try {
        const res = await $api.get<ChatResponse>(endpoints.spaces(uuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.COLLECTION, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.activeSpace = {} as ChatInterface;
      }
      return {} as ChatInterface;
    },
  },
});
