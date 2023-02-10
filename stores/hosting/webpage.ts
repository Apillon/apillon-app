import { defineStore } from 'pinia';

const dataStore = useDataStore();
const bucketStore = useBucketStore();
const deploymentStore = useDeploymentStore();

export const useWebpageStore = defineStore('webpage', {
  state: () => ({
    active: {} as WebpageInterface,
    items: [] as Array<WebpageInterface>,
    loading: false,
    search: '',
    selected: 0,
    quotaReached: undefined as Boolean | undefined,
    uploadActive: false,
  }),
  getters: {
    hasWebpages(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasWebpageItems(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as WebpageInterface;
      this.items = [] as Array<WebpageInterface>;
      this.search = '';
      this.selected = 0;
      this.quotaReached = undefined;
    },
    setWebpageId(id: number) {
      if (this.selected !== id) {
        this.selected = id;
        deploymentStore.active = {} as DeploymentInterface;
        deploymentStore.staging = [] as Array<DeploymentInterface>;
        deploymentStore.production = [] as Array<DeploymentInterface>;
        bucketStore.folder.items = [] as Array<BucketItemInterface>;
        bucketStore.folder.total = 0;
        bucketStore.folder.path = [];
        bucketStore.folder.selected = 0;
        bucketStore.folderSearch();
      }
    },

    /**
     * Fetch wrappers
     */
    async getWebpages() {
      if (!this.hasWebpages || isCacheExpired(LsCacheKeys.BUCKETS)) {
        await this.fetchWebpages();
      }
    },

    /** Find bucket by ID, if bucket doesn't exists in store, fetch it */
    async getWebpage(webpageId: number): Promise<WebpageInterface> {
      if (this.active?.id === webpageId && !isCacheExpired(LsCacheKeys.WEBPAGE)) {
        return this.active;
      }
      return await this.fetchWebpage(webpageId);
    },

    /**
     * API calls
     */
    async fetchWebpages() {
      this.loading = true;
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
        };

        const req = $api.get<WebpagesResponse>(endpoints.webpages(), params);
        dataStore.promises.webpages = req;
        const res = await req;

        this.items = res.data.items;
        this.search = '';

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.WEBPAGES, Date.now().toString());
      } catch (error: any) {
        this.items = [] as Array<WebpageInterface>;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
    },

    async fetchWebpage(id: number): Promise<WebpageInterface> {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }
      try {
        const res = await $api.get<WebpageResponse>(endpoints.webpages(id));

        this.active = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.WEBPAGE, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as WebpageInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as WebpageInterface;
    },

    async fetchWebpageQuota() {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<WebpageQuotaResponse>(endpoints.webpageQuota, {
          project_uuid: dataStore.projectUuid,
        });

        this.quotaReached = res.data;
      } catch (error: any) {
        this.quotaReached = undefined;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },
  },
});
