import { defineStore } from 'pinia';

export const useStorageStore = defineStore('storage', {
  state: () => ({
    info: {} as StorageInfoInterface,
    projectConfig: undefined as GithubProjectConfig | undefined,
    loading: false,
    deployConfigForm: {
      branchName: '',
      buildCommand: '',
      buildDirectory: '',
      installCommand: '',
      apiKey: undefined as string | undefined,
      apiSecret: '',
      repoId: undefined as number | undefined,
      repoName: '',
      repoOwnerName: '',
    },
    repos: [] as GithubRepo[],
  }),
  getters: {
    hasInfo(state): boolean {
      return state.info && state.info?.availableStorage > 0;
    },
    hasProjectConfigLoaded(state): boolean {
      return !!state.projectConfig;
    },
    hasReposLoaded(state): boolean {
      return state.repos.length > 0;
    },
  },
  actions: {
    resetData() {
      this.info = {} as StorageInfoInterface;
    },

    /**
     *
     * Fetch wrappers
     */
    async getStorageInfo() {
      if (!this.hasInfo || isCacheExpired(LsCacheKeys.STORAGE_INFO)) {
        await this.fetchStorageInfo();
      }
    },

    async getGithubProjectConfig() {
      if (!this.hasProjectConfigLoaded || isCacheExpired(LsCacheKeys.GITHUB_PROJECT_CONFIG)) {
        await this.fetchGithubProjectConfig();
      }
    },

    async getRepos() {
      if (!this.hasReposLoaded || isCacheExpired(LsCacheKeys.GITHUB_REPOS)) {
        await this.fetchRepos();
      }
    },

    /**
     * API calls
     */
    async fetchStorageInfo() {
      this.loading = true;

      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();

        if (!dataStore.projectUuid) return;
      }

      try {
        const res = await $api.get<StorageInfoResponse>(endpoints.storageInfo, {
          project_uuid: dataStore.projectUuid,
        });
        this.info = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.STORAGE_INFO, Date.now().toString());
      } catch (error: any) {
        this.info = {} as StorageInfoInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
    },

    async fetchGithubProjectConfig() {
      this.loading = true;
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();

        if (!dataStore.projectUuid) return;
      }

      try {
        const res = await $api.get<GithubProjectConfigResponse>(endpoints.githubProjectConfig(dataStore.projectUuid));
        this.projectConfig = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.GITHUB_PROJECT_CONFIG, Date.now().toString());
      } catch (error: any) {
        this.projectConfig = undefined;
        window.$message.error(userFriendlyMsg(error));
      }
    },

    async fetchRepos() {
      this.loading = true;
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();

        if (!dataStore.projectUuid) return;
      }

      try {
        const res = await $api.get<GithubReposResponse>(endpoints.githubRepos(dataStore.projectUuid));
        this.repos = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.GITHUB_REPOS, Date.now().toString());
      } catch (error: any) {
        this.repos = [];
        window.$message.error(userFriendlyMsg(error));
      }
    },
  },
});
