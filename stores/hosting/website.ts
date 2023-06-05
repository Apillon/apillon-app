import { defineStore } from 'pinia';

const dataStore = useDataStore();
const bucketStore = useBucketStore();
const deploymentStore = useDeploymentStore();

export const useWebsiteStore = defineStore('website', {
  state: () => ({
    active: {} as WebsiteInterface,
    items: [] as Array<WebsiteBaseInterface>,
    loading: false,
    search: '',
    selected: 0,
    quotaReached: undefined as Boolean | undefined,
    uploadActive: false,
  }),
  getters: {
    hasWebsites(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasWebsiteItems(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as WebsiteInterface;
      this.items = [] as Array<WebsiteBaseInterface>;
      this.search = '';
      this.selected = 0;
      this.quotaReached = undefined;
    },
    setWebsiteId(id: number) {
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

    getWebsiteUpdateTime(id: number): string | null | undefined {
      const website = this.items.find(item => item.id === id);
      return website ? website.updateTime : null;
    },

    /**
     * Fetch wrappers
     */
    async getWebsites() {
      if (!this.hasWebsites || isCacheExpired(LsCacheKeys.WEBSITES)) {
        await this.fetchWebsites();
      }
    },

    /** Find bucket by ID, if bucket doesn't exists in store, fetch it */
    async getWebsite(websiteId: number): Promise<WebsiteInterface> {
      if (this.active?.id === websiteId && !isCacheExpired(LsCacheKeys.WEBSITE)) {
        return this.active;
      }
      return await this.fetchWebsite(websiteId);
    },

    /**
     * API calls
     */
    async fetchWebsites() {
      this.loading = true;
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
          ...PARAMS_ALL_ITEMS,
        };

        const req = $api.get<WebsitesBaseResponse>(endpoints.websites(), params);
        dataStore.promises.websites = req;
        const res = await req;

        this.items = res.data.items;
        this.search = '';

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.WEBSITES, Date.now().toString());
      } catch (error: any) {
        /** Clear promise */
        dataStore.promises.websites = null;
        this.items = [] as Array<WebsiteBaseInterface>;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
    },

    async fetchWebsite(id: number): Promise<WebsiteInterface> {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }
      try {
        const res = await $api.get<WebsiteResponse>(endpoints.websites(id));

        this.active = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.WEBSITE, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as WebsiteInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as WebsiteInterface;
    },

    async fetchWebsiteQuota() {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<WebsiteQuotaResponse>(endpoints.websiteQuota, {
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
