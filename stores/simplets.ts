import { defineStore } from 'pinia';

export const useSimpletStore = defineStore('simplets', {
  state: () => ({
    active: {} as SimpletInterface,
    items: [] as SimpletInterface[],
    templates: [] as SimpletTemplateInterface[],
    loading: false,
    pagination: createPagination(),
    search: '',
    archive: {
      items: [] as SimpletInterface[],
      loading: false,
      search: '',
      pagination: createPagination(),
    },
    stepSimpletCreate: SimpletCreateStep.COLLECTION,
    form: {
      type: null as Optional<SimpletType>,
      collection: null as Optional<CollectionInterface>,
      collectionLogo: undefined as Optional<string | undefined>,
      name: '',
      description: '',
      embeddedWallet: null as Optional<string>,
      walletAddress: null as Optional<string>,
      startTime: null as Optional<number>,
      endTime: null as Optional<number>,
      apiKey: null as Optional<string>,
      apiSecret: null as Optional<string>,
      mysql: {
        host: 'localhost',
        port: 3306,
        database: 'db_nft_studio',
        user: '',
        password: '',
      },
      smtp: {
        host: ' ',
        port: 465,
        username: ' ',
        password: ' ',
        senderName: ' ',
        senderEmail: ' ',
      },
    },
  }),
  getters: {
    hasTemplates(state): boolean {
      return Array.isArray(state.templates) && state.templates.length > 0;
    },
    hasSimplets(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    showSimplets(state): boolean {
      return state.loading || !!state.search || (Array.isArray(state.items) && state.items.length > 0);
    },
    hasSimpletsArchive(state): boolean {
      return Array.isArray(state.archive.items) && state.archive.items.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as SimpletInterface;
      this.items = [] as SimpletInterface[];
      this.templates = [] as SimpletTemplateInterface[];
      this.search = '';
      this.archive.items = [] as SimpletInterface[];
      this.archive.pagination.page = 1;
      this.archive.pagination.itemCount = 0;
      this.archive.search = '';
      this.resetForm();
    },
    resetForm() {
      this.form.type = null as Optional<SimpletType>;
      this.form.collection = null;
      this.form.collectionLogo = undefined;
      this.form.name = '';
      this.form.description = '';
      this.form.embeddedWallet = null;
      this.form.walletAddress = '';
      this.form.startTime = null;
      this.form.endTime = null;
      this.form.apiKey = null;
      this.form.apiSecret = '';
      this.resetFormMySql();
      this.resetFormSmtp();
    },
    resetFormMySql() {
      this.form.mysql.host = 'localhost';
      this.form.mysql.port = 3306;
      this.form.mysql.database = 'db_nft_studio';
      this.form.mysql.user = '';
      this.form.mysql.password = '';
    },
    resetFormSmtp() {
      this.form.smtp.host = ' ';
      this.form.smtp.port = 465;
      this.form.smtp.username = ' ';
      this.form.smtp.password = ' ';
      this.form.smtp.senderName = ' ';
      this.form.smtp.senderEmail = ' ';
    },

    /**
     * Fetch wrappers
     */
    async getSimpletTemplates() {
      if (this.templates.length) {
        return this.items;
      }
      return await this.fetchSimpletTemplates();
    },
    async getSimplets(page = 1, limit = PAGINATION_LIMIT) {
      if (this.items.length && !isCacheExpired(LsCacheKeys.SIMPLETS)) {
        return this.items;
      }
      return await this.fetchSimplets(page, limit);
    },
    async getSimpletsArchive(page = 1, limit = PAGINATION_LIMIT) {
      if (
        page !== this.archive.pagination.page ||
        !this.hasSimpletsArchive ||
        isCacheExpired(LsCacheKeys.SIMPLETS_ARCHIVED)
      ) {
        return await this.fetchSimplets(page, limit, true);
      }
      return this.items;
    },

    async getSimplet(simpletUuid: string) {
      if (this.active?.simplet_uuid === simpletUuid && !isCacheExpired(LsCacheKeys.SIMPLET)) {
        return this.active;
      }
      return await this.fetchSimplet(simpletUuid);
    },

    /**
     * API calls
     */
    async fetchSimpletTemplates(): Promise<SimpletTemplateInterface[]> {
      const dataStore = useDataStore();
      if (!dataStore.projectUuid) return this.templates;

      try {
        const { data } = await $api.get<SimpletTemplatesResponse>(endpoints.simplets());
        this.templates = data.items;
      } catch (error: any) {
        this.templates = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.loading = false;
      }
      return this.templates;
    },

    async fetchSimplets(
      page = 1,
      limit = PAGINATION_LIMIT,
      isArchive: boolean = false,
      showLoader: boolean = true
    ): Promise<SimpletInterface[]> {
      const store = isArchive ? this.archive : this;

      const dataStore = useDataStore();
      if (!dataStore.projectUuid) return store.items;

      store.loading = showLoader;
      try {
        const params = parseArguments({
          limit,
          page,
          search: store.search,
          project_uuid: dataStore.projectUuid,
          status: isArchive ? SqlModelStatus.ARCHIVED : undefined,
        });
        const { data } = await $api.get<SimpletsResponse>(endpoints.simpletDeployed(), params);
        store.items = data.items;
        store.pagination.itemCount = data.total;

        const key = isArchive ? LsCacheKeys.SIMPLETS_ARCHIVED : LsCacheKeys.SIMPLETS;
        sessionStorage.setItem(key, Date.now().toString());
      } catch (error: any) {
        store.items = [];
        store.pagination.itemCount = 0;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        store.loading = false;
      }

      return store.items;
    },

    async fetchSimplet(simpletUuid: string | undefined) {
      if (!simpletUuid) return;

      try {
        const res = await $api.get<SimpletResponse>(endpoints.simpletDeployed(simpletUuid));
        this.active = res.data;

        sessionStorage.setItem(LsCacheKeys.SIMPLET, Date.now().toString());
      } catch (e: ApiError | any) {
        console.error(e);
        this.active = {} as SimpletInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(e));
      }
      return this.active;
    },
  },

  persist: {
    key: SessionKeys.SIMPLETS_STORE,
    storage: piniaPluginPersistedstate.sessionStorage(),
    pick: ['active', 'items', 'simplets', 'archive.items'],
  },
});
