import { defineStore } from 'pinia';

export const useSimpletStore = defineStore('simplets', {
  state: () => ({
    active: {} as SimpletInterface,
    backend: {} as SimpletBackendInterface,
    items: [] as SimpletInterface[],
    templates: [] as SimpletTemplateInterface[],
    loading: false,
    modalCreateVisible: false,
    pagination: createPagination(),
    quotaReached: undefined as boolean | undefined,
    search: '',
    stepSimpletCreate: SimpletCreateStep.COLLECTION,
    archive: {
      items: [] as SimpletInterface[],
      loading: false,
      search: '',
      pagination: createPagination(),
    },
    form: {
      type: null as Optional<SimpletTemplateInterface>,
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
        host: 'nft_studio_db',
        port: 3306,
        database: 'db_nft_studio',
        user: '',
        password: '',
      },
      smtp: {
        host: '',
        port: 25,
        username: '',
        password: '',
        senderName: '',
        senderEmail: '',
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
      this.backend = {} as SimpletBackendInterface;
      this.items = [] as SimpletInterface[];
      this.templates = [] as SimpletTemplateInterface[];
      this.search = '';
      this.archive.items = [] as SimpletInterface[];
      this.archive.pagination.page = 1;
      this.archive.pagination.itemCount = 0;
      this.archive.search = '';
      this.resetWizard();
    },
    resetWizard() {
      this.modalCreateVisible = false;
      this.quotaReached = undefined;
      this.stepSimpletCreate = SimpletCreateStep.COLLECTION;
      this.resetForm();
    },
    resetForm() {
      this.form.type = null as Optional<SimpletTemplateInterface>;
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
      this.form.mysql.host = 'nft_studio_db';
      this.form.mysql.port = 3306;
      this.form.mysql.database = 'db_nft_studio';
      this.form.mysql.user = '';
      this.form.mysql.password = '';
    },
    resetFormSmtp() {
      this.form.smtp.host = '';
      this.form.smtp.port = 25;
      this.form.smtp.username = '';
      this.form.smtp.password = '';
      this.form.smtp.senderName = '';
      this.form.smtp.senderEmail = '';
    },

    getBackendVariable(key: string): string | undefined {
      return this.backend?.environmentVariables?.find(v => v.key === key)?.value;
    },

    findTemplate(name?: string): SimpletTemplateInterface | undefined {
      return this.templates.find(t => t.name === name);
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
    async getBackend(backendUuid: string) {
      if (this.backend?.backend_uuid === backendUuid && !isCacheExpired(LsCacheKeys.SIMPLET_BACKEND)) {
        return this.backend;
      }
      return await this.fetchBackend(backendUuid);
    },
    async getSimpletQuota() {
      if (this.quotaReached === undefined) {
        await this.fetchSimpletQuota();
      }
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
          status: isArchive ? SqlModelStatus.DELETED : undefined,
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

    async fetchSimplet(simpletUuid: string | undefined, showLoader = true) {
      if (!simpletUuid) return;

      this.loading = showLoader;
      try {
        const { data } = await $api.get<SimpletResponse>(endpoints.simpletDeployed(simpletUuid));
        this.active = data;

        sessionStorage.setItem(LsCacheKeys.SIMPLET, Date.now().toString());
      } catch (e: ApiError | any) {
        console.error(e);
        this.active = {} as SimpletInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(e));
      }
      this.loading = false;
      return this.active;
    },

    async fetchBackend(backendUuid: string | undefined) {
      if (!backendUuid) return;

      try {
        const { data } = await $api.get<SimpletBackendResponse>(endpoints.simpletBackend(backendUuid));
        this.backend = data;

        sessionStorage.setItem(LsCacheKeys.SIMPLET_BACKEND, Date.now().toString());
      } catch (e: ApiError | any) {
        console.error(e);
        this.backend = {} as SimpletBackendInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(e));
      }
      return this.backend;
    },

    async fetchSimpletQuota() {
      const dataStore = useDataStore();
      await dataStore.waitOnPromises(false);
      if (!dataStore.projectUuid) return;
      try {
        const res = await $api.get<SimpletQuotaResponse>(endpoints.simpletQuotaReached(dataStore.projectUuid));
        this.quotaReached = res.data.quotaReached;
      } catch (error: ApiError | any) {
        this.quotaReached = undefined;
        window.$message.error(userFriendlyMsg(error));
      }
    },
  },

  persist: {
    key: SessionKeys.SIMPLETS_STORE,
    storage: piniaPluginPersistedstate.sessionStorage(),
    pick: ['active', 'items', 'simplets', 'archive.items'],
  },
});
