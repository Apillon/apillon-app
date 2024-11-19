import { defineStore } from 'pinia';

export const useProductHuntStore = defineStore('productHunt', {
  state: () => ({
    comment: null as ProductHuntComment | null,
    form: {
      url: '',
    },
  }),

  getters: {
    hasProductHuntComment(state): boolean {
      return !!state.comment;
    },
  },

  actions: {
    async getComment() {
      if (!this.hasProductHuntComment || isCacheExpired(LsCacheKeys.PRODUCT_HUNT_COMMENT)) {
        await this.fetchComment();
      }
      return this.comment;
    },

    async fetchComment() {
      const dataStore = useDataStore();

      try {
        const req = $api.get<ProductHuntCommentResponse>(endpoints.productHuntComment);
        dataStore.promises.productHuntComment = req;

        const res = await req;

        this.comment = res.data;

        sessionStorage.setItem(LsCacheKeys.PRODUCT_HUNT_COMMENT, Date.now().toString());

        return res.data;
      } catch (error) {
        dataStore.promises.productHuntComment = null;
        this.comment = null;
      }

      return null;
    },
  },
});
