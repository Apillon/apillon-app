import { defineStore } from 'pinia';

export const useJobStore = defineStore('job', {
  state: () => ({
    active: {} as JobInterface,
    items: [] as JobInterface[],
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
      this.active = {} as JobInterface;
      this.items = [] as JobInterface[];
      this.search = '';
      this.pagination.itemCount = 0;
      this.pagination.page = 1;
    },

    /**
     * Fetch wrappers
     */
    async getJobs(functionUuid: string, page = 1): Promise<JobInterface[]> {
      if (page !== this.pagination.page || !this.hasJobs || isCacheExpired(LsCacheKeys.JOBS)) {
        return await this.fetchJobs(functionUuid);
      }
      return this.items;
    },

    async getJob(jobUuid: string): Promise<JobInterface> {
      if (this.active?.job_uuid === jobUuid && !isCacheExpired(LsCacheKeys.CLOUD_FUNCTION)) {
        return this.active;
      }
      return await this.fetchJob(jobUuid);
    },

    /**
     * API calls
     */
    async fetchJobs(functionUuid: string, showLoader: boolean = true): Promise<JobInterface[]> {
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

        const res = await $api.get<JobsResponse>(endpoints.acurastJobs(functionUuid), params);

        this.items = res.data.items;
        this.total = res.data.total;
        this.search = '';
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.JOBS, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        this.items = [] as Array<JobInterface>;
        this.total = 0;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      this.loading = false;
      return [];
    },

    async fetchJob(uuid: string): Promise<JobInterface> {
      try {
        const res = await $api.get<JobResponse>(endpoints.acurastJobs(uuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.JOB, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as JobInterface;
      }
      return {} as JobInterface;
    },
  },
});
