import { defineStore } from 'pinia';

export const useJobStore = defineStore('job', {
  state: () => ({
    active: {} as CloudFunctionInterface,
    items: [] as CloudFunctionInterface[],
    loading: false,
    search: '',
    total: 0,
    pagination: {
      page: 1,
      pageSize: PAGINATION_LIMIT,
      itemCount: 0,
    },
  }),
  getters: {
    hasJobs(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as CloudFunctionInterface;
      this.items = [] as CloudFunctionInterface[];
      this.search = '';
      this.pagination.itemCount = 0;
      this.pagination.page = 1;
    },

    /**
     * Fetch wrappers
     */
    async getJobs(page = 1): Promise<CloudFunctionInterface[]> {
      if (page !== this.pagination.page || !this.hasJobs || isCacheExpired(LsCacheKeys.JOBS)) {
        return await this.fetchJobs();
      }
      return this.items;
    },

    async getJob(jobUuid: string): Promise<CloudFunctionInterface> {
      if (this.active?.job_uuid === jobUuid && !isCacheExpired(LsCacheKeys.CLOUD_FUNCTION)) {
        return this.active;
      }
      return await this.fetchJob(jobUuid);
    },

    /**
     * API calls
     */
    async fetchJobs(
      cloudFunctionUuid: string,
      showLoader: boolean = true
    ): Promise<CloudFunctionInterface[]> {
      this.loading = showLoader;

      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const params: Record<string, string | number> = {
          project_uuid: dataStore.projectUuid,
          orderBy: 'createTime',
          desc: 'true',
          ...PARAMS_ALL_ITEMS,
        };

        const res = await $api.get<CloudFunctionsResponse>(
          endpoints.acurastJobs(cloudFunctionUuid),
          params
        );

        this.items = res.data.items;
        this.total = res.data.total;
        this.search = '';
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.JOBS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.items = [] as Array<CloudFunctionInterface>;
        this.total = 0;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      this.loading = false;
      return [];
    },

    async fetchJob(uuid: string): Promise<CloudFunctionInterface> {
      try {
        const res = await $api.get<CloudFunctionResponse>(endpoints.cloudFunctions(uuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.JOB, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as CloudFunctionInterface;
      }
      return {} as CloudFunctionInterface;
    },
  },
});
