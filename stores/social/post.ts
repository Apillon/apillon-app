import { defineStore } from 'pinia';
import type { GrillConfig } from '@subsocial/grill-widget';

/** Grill chat */
export const generateGrillSettings = (spaceId: string, postId: string): GrillConfig => {
  return {
    theme: 'dark',
    widgetElementId: 'grill',
    hub: { id: spaceId },
    channel: {
      type: 'channel',
      id: postId,
      settings: {
        enableBackButton: true,
        enableLoginButton: true,
        enableInputAutofocus: true,
      },
    },
  };
};

export const usePostStore = defineStore('post', {
  state: () => ({
    active: {} as PostInterface,
    items: [] as PostInterface[],
    loading: false,
    search: '',
    settings: null as any,
    pagination: {
      page: 1,
      pageSize: PAGINATION_LIMIT,
      itemCount: 0,
    },
  }),
  getters: {
    hasPosts(state): boolean {
      return (
        !!state.search || state.loading || (Array.isArray(state.items) && state.items.length > 0)
      );
    },
  },
  actions: {
    resetData() {
      this.active = {} as PostInterface;
      this.items = [] as PostInterface[];
      this.pagination.page = 1;
      this.pagination.itemCount = 0;
      this.search = '';
    },

    /**
     * Fetch wrappers
     */
    async getPosts(spaceUuid: string, page = 1): Promise<PostInterface[]> {
      if (page !== this.pagination.page || !this.hasPosts || isCacheExpired(LsCacheKeys.POSTS)) {
        return await this.fetchPosts(spaceUuid);
      }
      return this.items;
    },

    async getPost(spaceUuid: string, post_uuid: string): Promise<PostInterface> {
      if (this.active?.post_uuid === post_uuid && !isCacheExpired(LsCacheKeys.POST)) {
        return this.active;
      }
      return await this.fetchPost(spaceUuid, post_uuid);
    },

    /**
     * API calls
     */
    async fetchPosts(
      spaceUuid: string,
      page?: number,
      showLoader: boolean = true
    ): Promise<PostInterface[]> {
      this.loading = showLoader;

      try {
        const params: Record<string, string | number> = {
          orderBy: 'createTime',
          desc: 'true',
          limit: this.pagination.pageSize,
          page: page || this.pagination.page,
        };
        if (this.search) params.search = this.search;

        const res = await $api.get<PostsResponse>(endpoints.posts(spaceUuid), params);

        this.items = res.data.items;
        this.pagination.itemCount = res.data.total;
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.POSTS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.items = [] as Array<PostInterface>;
        this.pagination.itemCount = 0;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      this.loading = false;
      return [];
    },

    async fetchPost(spaceUuid: string, post_uuid: string): Promise<PostInterface> {
      try {
        const res = await $api.get<PostResponse>(endpoints.posts(spaceUuid, chatUuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.POST, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as PostInterface;
      }
      return {} as PostInterface;
    },
  },
});
