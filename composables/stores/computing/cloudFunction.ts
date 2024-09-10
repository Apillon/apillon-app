import { defineStore } from 'pinia';

export const useCloudFunctionStore = defineStore('cloudFunction', {
  state: () => ({
    active: {} as CloudFunctionInterface,
    items: [] as CloudFunctionInterface[],
    loading: false,
    loadingVariables: false,
    search: '',
    searchJobs: '',
    searchVariables: '',
    total: 0,
    usage: [] as CloudFunctionUsageInterface[],
    variables: [] as EnvVariable[],
    variablesNew: [] as EnvVariable[],
    pagination: {
      page: 1,
      pageSize: PAGINATION_LIMIT,
      itemCount: 0,
    },
  }),
  getters: {
    functionUuid(state): string {
      return state.active.function_uuid;
    },
    jobs(state): JobInterface[] {
      return state.active.jobs;
    },
    hasCloudFunctions(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasJobs(state): boolean {
      return Array.isArray(state.active.jobs) && state.active.jobs.length > 0;
    },
    hasUsage(state): boolean {
      return Array.isArray(state.usage) && state.usage.length > 0;
    },
    hasVariables(state): boolean {
      return (
        (Array.isArray(state.variables) && state.variables.length > 0) ||
        (Array.isArray(state.variablesNew) && state.variablesNew.length > 0)
      );
    },
    hasVariablesExisting(state): boolean {
      return Array.isArray(state.variables) && state.variables.length > 0;
    },
    hasVariablesNew(state): boolean {
      return Array.isArray(state.variablesNew) && state.variablesNew.length > 0;
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

    addJob(job: JobInterface) {
      this.active.jobs.push(job);
    },
    updateJob(job: JobInterface) {
      this.active.jobs.forEach(item => {
        if (item.job_uuid === job.job_uuid) {
          Object.assign(item, job);
        }
      });
    },
    removeJob(jobUuid: string) {
      this.active.jobs = this.active.jobs.filter(item => item.job_uuid !== jobUuid);
    },

    /**
     * Fetch wrappers
     */
    async getCloudFunctions(page = 1): Promise<CloudFunctionInterface[]> {
      if (
        page !== this.pagination.page ||
        !this.hasCloudFunctions ||
        isCacheExpired(LsCacheKeys.CLOUD_FUNCTIONS)
      ) {
        return await this.fetchCloudFunctions();
      }
      return this.items;
    },

    async getCloudFunction(functionUuid: string): Promise<CloudFunctionInterface> {
      if (
        this.active?.function_uuid === functionUuid &&
        !isCacheExpired(LsCacheKeys.CLOUD_FUNCTION)
      ) {
        return this.active;
      }
      return await this.fetchCloudFunction(functionUuid);
    },

    async getUsage(functionUuid: string): Promise<EnvVariable[]> {
      if (
        !this.hasVariables ||
        this.active?.function_uuid !== functionUuid ||
        isCacheExpired(LsCacheKeys.CLOUD_FUNCTION_USAGE)
      ) {
        await this.fetchUsage(functionUuid);
      }
      return this.variables;
    },

    async getVariables(functionUuid: string): Promise<EnvVariable[]> {
      if (
        !this.hasVariables ||
        this.active?.function_uuid !== functionUuid ||
        isCacheExpired(LsCacheKeys.CLOUD_FUNCTION_VARIABLES)
      ) {
        await this.fetchVariables(functionUuid);
      }
      return this.variables;
    },

    /**
     * API calls
     */
    async fetchCloudFunctions(showLoader: boolean = true): Promise<CloudFunctionInterface[]> {
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

        const res = await $api.get<CloudFunctionsResponse>(endpoints.cloudFunctions(), params);

        this.items = res.data.items;
        this.total = res.data.total;
        this.search = '';
        this.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CLOUD_FUNCTIONS, Date.now().toString());

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

    async fetchCloudFunction(uuid: string): Promise<CloudFunctionInterface> {
      try {
        const res = await $api.get<CloudFunctionResponse>(endpoints.cloudFunctions(uuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CLOUD_FUNCTION, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as CloudFunctionInterface;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as CloudFunctionInterface;
    },

    async fetchUsage(uuid: string): Promise<CloudFunctionUsageInterface[]> {
      try {
        const res = await $api.get<CloudFunctionUsageResponse>(endpoints.cloudFunctionUsage(uuid));
        this.usage = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CLOUD_FUNCTION_USAGE, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.usage = [];

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return [];
    },

    async fetchVariables(uuid: string): Promise<EnvVariable[]> {
      this.loadingVariables = true;
      try {
        const res = await $api.get<EnvironmentResponse>(endpoints.cloudFunctionEnvironment(uuid));
        this.variables = res.data;
        this.loadingVariables = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CLOUD_FUNCTION_VARIABLES, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.variables = [];
        this.loadingVariables = false;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      return [];
    },
  },
});
