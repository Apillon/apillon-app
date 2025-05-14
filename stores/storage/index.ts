import { defineStore } from 'pinia';
import NextJsPNG from '/assets/images/hosting/nextJs.png';

const apillonOwner = { avatar_url: 'https://avatars.githubusercontent.com/u/68999895?s=48&v=4', login: 'Apillon' };

export const apillonRepos: GithubRepo[] = [
  {
    clone_url: 'https://github.com/Apillon/nft-template.git',
    default_branch: 'master',
    id: 629913711,
    image: NextJsPNG,
    name: 'nft-template',
    owner: apillonOwner,
    updated_at: '2024-02-15T08:56:38Z',
    html_url: '',
  },
  {
    clone_url: 'https://github.com/Apillon/nft-template-vue.git',
    default_branch: 'master',
    id: 657149828,
    image: NextJsPNG,
    name: 'nft-template-vue',
    owner: apillonOwner,
    updated_at: '2024-02-15T08:56:38Z',
    html_url: '',
  },
  {
    clone_url: 'https://github.com/Apillon/nft-template-react.git',
    default_branch: 'master',
    id: 657149144,
    image: NextJsPNG,
    name: 'nft-template-react',
    owner: apillonOwner,
    updated_at: '2024-02-15T08:56:38Z',
    html_url: '',
  },
];

export const useStorageStore = defineStore('storage', {
  state: () => ({
    info: {} as StorageInfoInterface,
    projectConfig: undefined as GithubProjectConfig | undefined,
    loading: false,
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
      const dataStore = useDataStore();
      await dataStore.waitOnPromises();
      if (!dataStore.projectUuid) return;

      this.loading = true;
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
      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();

      this.loading = true;
      try {
        const res = await $api.get<GithubProjectConfigResponse>(endpoints.githubProjectConfig(projectUuid));
        this.projectConfig = res.data;
        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.GITHUB_PROJECT_CONFIG, Date.now().toString());
      } catch (error: any) {
        this.projectConfig = undefined;
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
    },

    async fetchRepos() {
      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();

      if (this.projectConfig === undefined) await this.getGithubProjectConfig();
      if (!this.hasProjectConfigLoaded) return;

      this.loading = true;
      try {
        const res = await $api.get<GithubReposResponse>(endpoints.githubRepos(projectUuid));
        this.repos = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.GITHUB_REPOS, Date.now().toString());
      } catch (error: any) {
        this.repos = [];
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
    },
  },
});
