import { defineStore } from 'pinia';
import type { WebsiteType } from '~/lib/types/hosting';
import { WebsiteCreateStep, WebsiteSource } from '~/lib/types/hosting';

export const useWebsiteStore = defineStore('website', {
  state: () => ({
    active: {} as WebsiteInterface,
    archive: [] as WebsiteBaseInterface[],
    items: [] as WebsiteBaseInterface[],
    loading: false,
    missingHtml: false,
    modalNewWebsiteVisible: false as boolean | null,
    search: '',
    selected: '',
    stepWebsiteCreate: WebsiteCreateStep.TYPE,
    uploadActive: false,
    form: {
      type: null as Optional<WebsiteType>,
      name: '',
      description: '',
      branchName: 'main',
      buildCommand: 'npm run build',
      buildDirectory: './dist',
      installCommand: 'npm install',
      apiKey: undefined as Optional<string> | undefined,
      apiSecret: undefined as Optional<string> | undefined,
      repoId: undefined as number | undefined,
      repoName: '',
      repoOwnerName: '',
      repoUrl: '',
      embeddedWallet: '',
      nftCollection: '',
      templateType: 0,
    },
  }),
  getters: {
    hasWebsites(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasWebsiteItems(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasWebsiteArchive(state): boolean {
      return Array.isArray(state.archive) && state.archive.length > 0;
    },
    isActiveWebsiteGithubSource(state): boolean {
      return state.active.source === WebsiteSource.GITHUB;
    },
    isActiveWebsiteStatic(state): boolean {
      return state.active.source === WebsiteSource.APILLON && !state.active.nftCollectionUuid;
    },
  },
  actions: {
    resetData() {
      this.active = {} as WebsiteInterface;
      this.archive = [] as Array<WebsiteBaseInterface>;
      this.items = [] as Array<WebsiteBaseInterface>;
      this.search = '';
      this.selected = '';
    },
    resetForm() {
      this.form.type = null as Optional<WebsiteType>;
      this.form.name = '';
      this.form.description = '';
      this.form.branchName = 'main';
      this.form.buildCommand = 'npm run build';
      this.form.buildDirectory = './out';
      this.form.installCommand = 'npm install';
      this.form.apiKey = undefined;
      this.form.apiSecret = '';
      this.form.repoId = undefined;
      this.form.repoName = '';
      this.form.repoOwnerName = '';
      this.form.repoUrl = '';
      this.form.embeddedWallet = '';
      this.form.templateType = 0;
    },

    setWebsite(uuid: string) {
      if (this.selected !== uuid) {
        this.selected = uuid;

        const deploymentStore = useDeploymentStore();
        deploymentStore.active = {} as DeploymentInterface;
        deploymentStore.staging = [] as Array<DeploymentInterface>;
        deploymentStore.production = [] as Array<DeploymentInterface>;

        const bucketStore = useBucketStore();
        bucketStore.resetFolder();
        bucketStore.folderSearch();
      }
    },

    /**
     * Fetch wrappers
     */
    async getWebsites() {
      if (!this.hasWebsites || isCacheExpired(LsCacheKeys.WEBSITES)) {
        await this.fetchWebsites();
      }
    },

    async getWebsiteArchive() {
      if (!this.hasWebsiteArchive || isCacheExpired(LsCacheKeys.WEBSITE_ARCHIVE)) {
        await this.fetchWebsites(true);
      }
    },

    /** Find bucket by ID, if bucket doesn't exists in store, fetch it */
    async getWebsite(websiteUuid: string): Promise<WebsiteInterface> {
      if (this.active?.website_uuid === websiteUuid && !isCacheExpired(LsCacheKeys.WEBSITE)) {
        return this.active;
      }
      return await this.fetchWebsite(websiteUuid);
    },

    /**
     * API calls
     */
    async fetchWebsites(archive = false) {
      const dataStore = useDataStore();
      if (!dataStore.projectUuid) return [];

      this.loading = true;
      const key = archive ? 'archive' : 'items';
      try {
        const params = parseArguments(PARAMS_ALL_ITEMS);
        params.project_uuid = dataStore.projectUuid;
        if (archive) {
          params.status = SqlModelStatus.ARCHIVED;
        }

        const req = $api.get<WebsitesBaseResponse>(endpoints.websites(), params);
        dataStore.promises.websites = req;
        const res = await req;

        this[key] = res.data.items;
        this.search = '';

        /** Save timestamp to SS */
        const cacheKey = archive ? LsCacheKeys.WEBSITE_ARCHIVE : LsCacheKeys.WEBSITES;
        sessionStorage.setItem(cacheKey, Date.now().toString());
      } catch (error: any) {
        /** Clear promise */
        dataStore.promises.websites = null;
        this[key] = [] as Array<WebsiteBaseInterface>;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
    },

    async fetchWebsite(uuid: string): Promise<WebsiteInterface> {
      try {
        const { data } = await $api.get<WebsiteResponse>(endpoints.websites(uuid));
        this.active = data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.WEBSITE, Date.now().toString());

        return data;
      } catch (error: any) {
        this.active = {} as WebsiteInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as WebsiteInterface;
    },

    async fetchDomainStatus(uuid: string): Promise<WebsiteInterface | null> {
      try {
        const res = await $api.post<WebsiteResponse>(endpoints.websiteDomainStatus(uuid));
        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },
  },
});
