import { defineStore } from 'pinia';

export const useEmbeddedWalletStore = defineStore('embeddedWallet', {
  state: () => ({
    active: {} as EmbeddedWalletInterface,
    info: {} as EmbeddedWalletInfoInterface,
    items: [] as EmbeddedWalletInterface[],
    loading: false,
    search: '',
    pagination: createPagination(),
    signature: {
      items: [] as SignatureInterface[],
      loading: false,
      search: '',
      pagination: createPagination(),
    },
  }),
  getters: {
    hasEmbeddedWalletInfo(state) {
      return !!state.info;
    },
    hasEmbeddedWallets(state) {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasSignatures(state) {
      return Array.isArray(state.signature.items) && state.signature.items.length > 0;
    },
    integrationUuid(state) {
      return state.active.integration_uuid;
    },
  },
  actions: {
    resetData() {
      this.active = {} as EmbeddedWalletInterface;
      this.info = {} as EmbeddedWalletInfoInterface;
      this.items = [] as EmbeddedWalletInterface[];
      this.signature.items = [] as SignatureInterface[];
      this.search = '';
    },

    /**
     * Fetch wrappers
     */

    /** Oasis embedded wallets */
    async getEmbeddedWallets(page = 1, limit = PAGINATION_LIMIT) {
      if (
        this.pagination.page !== page ||
        !this.hasEmbeddedWallets ||
        isCacheExpired(LsCacheKeys.EMBEDDED_WALLETS)
      ) {
        await this.fetchEmbeddedWallets(page, limit);
      }
      return this.items;
    },
    async getEmbeddedWallet(integrationUuid: string) {
      if (
        this.active.integration_uuid === integrationUuid &&
        this.hasEmbeddedWallets &&
        !isCacheExpired(LsCacheKeys.EMBEDDED_WALLET)
      ) {
        return this.active;
      }
      return await this.fetchEmbeddedWallet(integrationUuid);
    },
    async getInfo() {
      if (!this.hasEmbeddedWalletInfo || isCacheExpired(LsCacheKeys.EMBEDDED_WALLET_INFO)) {
        await this.fetchInfo();
      }
      return this.active;
    },
    async getSignatures(integrationUuid: string, page = 1, limit = PAGINATION_LIMIT) {
      if (
        this.active.integration_uuid !== integrationUuid ||
        this.signature.pagination.page !== page ||
        !this.hasSignatures ||
        isCacheExpired(LsCacheKeys.EMBEDDED_WALLET_SIGNATURES)
      ) {
        await this.fetchSignatures(integrationUuid, page, limit);
      }
      return this.signature.items;
    },

    /**
     *
     * API calls
     */
    async fetchEmbeddedWallets(page: number, limit: number) {
      const dataStore = useDataStore();
      const project_uuid = await dataStore.getProjectUuid();
      if (!project_uuid) return;

      this.loading = true;
      try {
        const params = parseArguments({
          limit,
          page,
          project_uuid,
          search: this.search,
        });
        const res = await $api.get<EmbeddedWalletsResponse>(endpoints.embeddedWallets(), params);
        this.items = res.data.items;
        this.pagination.itemCount = res.data.total;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.EMBEDDED_WALLETS, Date.now().toString());
      } catch (error) {
        this.items = [] as EmbeddedWalletInterface[];
        this.pagination.itemCount = 0;
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
        this.search = '';
      }
    },

    async fetchEmbeddedWallet(integrationUuid: string) {
      this.loading = true;
      try {
        const res = await $api.get<EmbeddedWalletResponse>(
          endpoints.embeddedWallets(integrationUuid)
        );
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.EMBEDDED_WALLET, Date.now().toString());

        return res.data;
      } catch (error) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
      return null;
    },

    async fetchInfo() {
      const dataStore = useDataStore();
      const project_uuid = await dataStore.getProjectUuid();
      if (!project_uuid) return;

      this.loading = true;
      try {
        const res = await $api.get<EmbeddedWalletResponse>(endpoints.embeddedWalletInfo, {
          project_uuid,
        });
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.EMBEDDED_WALLET_INFO, Date.now().toString());

        return res.data;
      } catch (error) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
      return null;
    },

    async fetchSignatures(integrationUuid: string, page: number, limit: number) {
      this.signature.loading = true;
      try {
        const params = parseArguments({
          limit,
          page,
          search: this.signature.search,
        });

        const res = await $api.get<SignaturesResponse>(
          endpoints.embeddedWalletSignatures(integrationUuid),
          params
        );
        this.signature.items = res.data.items;
        this.signature.pagination.itemCount = res.data.total;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.EMBEDDED_WALLET_SIGNATURES, Date.now().toString());
      } catch (error) {
        this.signature.items = [] as SignatureInterface[];
        this.signature.pagination.itemCount = 0;
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.signature.loading = false;
        this.signature.search = '';
      }
    },
  },
});
