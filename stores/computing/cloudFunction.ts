import { defineStore } from 'pinia';

export const useCloudFunctionStore = defineStore('cloudFunction', {
  state: () => ({
    active: {} as CloudFunctionInterface,
    archive: [] as CloudFunctionInterface[],
    items: [] as CloudFunctionInterface[],
    loading: false,
    loadingVariables: false,
    search: '',
    searchJobs: '',
    searchVariables: '',
    total: 0,
    totalArchive: 0,
    usage: [] as CloudFunctionUsageInterface[],
    variables: [] as EnvVariable[],
    variablesNew: [] as EnvVariable[],
    variablesUpdate: false,
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
    gatewayUrl(state): string {
      return state.active.gatewayUrl || '';
    },
    jobs(state): JobInterface[] {
      return state.active.jobs;
    },
    hasCloudFunctions(state): boolean {
      return Array.isArray(state.items) && state.items.length > 0;
    },
    hasCloudFunctionsArchive(state): boolean {
      return Array.isArray(state.archive) && state.archive.length > 0;
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
      this.archive = [] as CloudFunctionInterface[];
      this.items = [] as CloudFunctionInterface[];
      this.search = '';
      this.loading = false;
      this.loadingVariables = false;
      this.pagination.itemCount = 0;
      this.pagination.page = 1;
      this.search = '';
      this.searchJobs = '';
      this.searchVariables = '';
      this.total = 0;
      this.totalArchive = 0;
      this.usage = [] as CloudFunctionUsageInterface[];
      this.resetVariables();
    },
    resetVariables() {
      this.variables = [] as EnvVariable[];
      this.variablesNew = [] as EnvVariable[];
      this.variablesUpdate = false;
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
    async getCloudFunctions() {
      if (!this.hasCloudFunctions || isCacheExpired(LsCacheKeys.CLOUD_FUNCTIONS)) {
        return await this.fetchCloudFunctions();
      }
      return this.items;
    },
    async getCloudFunctionsArchive() {
      if (!this.hasCloudFunctionsArchive || isCacheExpired(LsCacheKeys.CLOUD_FUNCTIONS_ARCHIVE)) {
        return await this.fetchCloudFunctions(true);
      }
      return this.items;
    },

    async getCloudFunction(functionUuid: string) {
      if (this.active?.function_uuid !== functionUuid || isCacheExpired(LsCacheKeys.CLOUD_FUNCTION)) {
        this.active = await this.fetchCloudFunction(functionUuid);
      }
      return this.active;
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
    async fetchCloudFunctions(archive = false, showLoader: boolean = true): Promise<CloudFunctionInterface[]> {
      const dataStore = useDataStore();
      if (!dataStore.projectUuid) return [];

      this.loading = showLoader;
      try {
        const params = parseArguments(PARAMS_ALL_ITEMS);
        params.project_uuid = dataStore.projectUuid;
        if (archive) {
          params.status = SqlModelStatus.ARCHIVED;
        }

        const res = await $api.get<CloudFunctionsResponse>(endpoints.cloudFunctions(), params);

        if (archive) {
          this.archive = res.data.items;
          this.totalArchive = res.data.total;
        } else {
          this.items = res.data.items;
          this.total = res.data.total;
        }
        this.search = '';
        this.loading = false;

        /** Save timestamp to SS */
        const key = archive ? LsCacheKeys.CLOUD_FUNCTIONS_ARCHIVE : LsCacheKeys.CLOUD_FUNCTIONS;
        sessionStorage.setItem(key, Date.now().toString());

        return res.data.items;
      } catch (error: any) {
        if (archive) {
          this.archive = [];
          this.totalArchive = 0;
        } else {
          this.items = [] as Array<CloudFunctionInterface>;
          this.total = 0;
        }

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }

      this.loading = false;
      return [];
    },

    async fetchCloudFunction(uuid: string, loading = true): Promise<CloudFunctionInterface> {
      this.loading = loading;
      try {
        const res = await $api.get<CloudFunctionResponse>(endpoints.cloudFunctions(uuid));

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CLOUD_FUNCTION, Date.now().toString());
        this.loading = false;

        return res.data;
      } catch (error: any) {
        this.active = {} as CloudFunctionInterface;

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
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
