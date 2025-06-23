import { defineStore } from 'pinia';

const loadMetadata = async (url: string): Promise<MetadataItem> => await (await fetch(url)).json();

export const useNftStore = defineStore('nft', {
  state: () => ({
    baseUri: '',
    items: [] as MetadataItem[],
    loading: false,
    pagination: createPagination(),
    token: '',
  }),
  getters: {},
  actions: {
    resetData() {
      this.items = [] as MetadataItem[];
    },

    async fetchNFTs(page = 1, limit = PageSize.SM): Promise<MetadataItem[]> {
      if (!this.baseUri || !this.token) {
        window.$message.warning('Missing baseUri or token!');
        return this.items;
      }

      this.loading = true;
      try {
        const data: Record<number, MetadataItem> = {};
        await Promise.all(
          Array.from({ length: limit }).map(async (v, i) => {
            const id = (page - 1) * limit + i + 1;
            data[id] = await loadMetadata(`${this.baseUri}${id}.json/${this.token}`).catch();
          })
        );
        this.items = Object.values(data).filter(d => !!d);
        this.loading = false;
        return this.items;
      } catch (error: any) {
        this.items = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
      return this.items;
    },
  },
});
