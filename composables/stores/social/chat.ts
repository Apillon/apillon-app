import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', {
  state: () => ({
    active: {} as ChatInterface,
    items: [] as ChatInterface[],
    loading: false,
    search: '',
    pagination: {
      page: 1,
      pageSize: PAGINATION_LIMIT,
      itemCount: 0,
    },
    archive: {
      items: [] as ChatInterface[],
      loading: false,
      search: '',
      pagination: {
        page: 1,
        pageSize: PAGINATION_LIMIT,
        itemCount: 0,
      },
    },
  }),
  getters: {
    hasChats(state): boolean {
      return (
        !!state.search || state.loading || (Array.isArray(state.items) && state.items.length > 0)
      );
    },
    hasChatArchive(state): boolean {
      return (
        !!state.archive.search ||
        state.archive.loading ||
        (Array.isArray(state.archive.items) && state.archive.items.length > 0)
      );
    },
  },
  actions: {
    resetData() {
      this.active = {} as ChatInterface;
      this.archive.items = [] as ChatInterface[];
      this.archive.pagination.page = 1;
      this.archive.pagination.itemCount = 0;
      this.archive.search = '';
      this.items = [] as ChatInterface[];
      this.pagination.itemCount = 0;
      this.pagination.page = 1;
      this.search = '';
    },

    /**
     * Fetch wrappers
     */
    async getChats(page = 1): Promise<ChatInterface[]> {
      if (page !== this.pagination.page || !this.hasChats || isCacheExpired(LsCacheKeys.CHATS)) {
        return await this.fetchChats(page);
      }
      return this.items;
    },
    async getChatArchive(page = 1): Promise<ChatInterface[]> {
      if (
        page !== this.archive.pagination.page ||
        !this.hasChats ||
        isCacheExpired(LsCacheKeys.CHAT_ARCHIVE)
      ) {
        return await this.fetchChatArchive(page);
      }
      return this.items;
    },

    async getChat(spaceUuid: string): Promise<ChatInterface> {
      if (this.active?.space_uuid === spaceUuid && !isCacheExpired(LsCacheKeys.CHAT)) {
        return this.active;
      }
      return await this.fetchChat(spaceUuid);
    },

    /**
     * API calls
     */
    async fetchChats(page?: number, showLoader: boolean = true): Promise<ChatInterface[]> {
      this.loading = showLoader;

      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();

      try {
        const params: Record<string, string | number> = {
          project_uuid: projectUuid,
          orderBy: 'createTime',
          desc: 'true',
          limit: this.pagination.pageSize,
          page: page || this.pagination.page,
        };
        if (this.search) params.search = this.search;

        const res = await $api.get<ChatsResponse>(endpoints.spaces(), params);

        this.items = res.data.items;
        this.pagination.itemCount = res.data.total;
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CHATS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.items = [] as Array<ChatInterface>;
        this.pagination.itemCount = 0;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      this.loading = false;
      return [];
    },

    async fetchChatArchive(page?: number, showLoader: boolean = true): Promise<ChatInterface[]> {
      this.archive.loading = showLoader;

      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();

      try {
        const params: Record<string, string | number> = {
          project_uuid: projectUuid,
          orderBy: 'createTime',
          desc: 'true',
          limit: this.archive.pagination.pageSize,
          page: page || this.archive.pagination.page,
          status: SqlModelStatus.ARCHIVED,
        };
        if (this.archive.search) params.search = this.archive.search;

        const res = await $api.get<ChatsResponse>(endpoints.spaces(), params);

        this.archive.items = res.data.items;
        this.archive.pagination.itemCount = res.data.total;
        this.archive.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CHAT_ARCHIVE, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.archive.items = [] as Array<ChatInterface>;
        this.archive.pagination.itemCount = 0;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      this.archive.loading = false;
      return [];
    },

    async fetchChat(uuid: string): Promise<ChatInterface> {
      /** Clear cache for posts */
      sessionStorage.removeItem(LsCacheKeys.POST);
      sessionStorage.removeItem(LsCacheKeys.POSTS);

      try {
        const res = await $api.get<ChatResponse>(endpoints.spaces(uuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CHAT, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as ChatInterface;
      }
      return {} as ChatInterface;
    },
  },
});
