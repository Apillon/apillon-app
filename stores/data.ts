import { defineStore } from 'pinia';

export const DataLsKeys = {
  CURRENT_PROJECT_ID: 'al_current_project_uuid',
  ONBOARDING: 'al_project_onboarding',
};

let abortController = null as AbortController | null;

export const useDataStore = defineStore('data', {
  state: () => ({
    instruction: {} as Record<string, InstructionInterface>,
    instructions: {} as Record<string, Array<InstructionInterface>>,
    project: {
      active: {} as ProjectInterface,
      items: [] as Array<ProjectInterface>,
      selected: localStorage.getItem(DataLsKeys.CURRENT_PROJECT_ID) || null,
      showOnboarding: false,
      quotaReached: undefined as boolean | undefined,
      overview: {} as ProjectOverviewInterface,
    },
    promises: {
      projects: null as any,
      buckets: null as any,
      websites: null as any,
      collections: null as any,
      contracts: null as any,
      rpcApiKeys: null as Promise<RpcApiKeysResponse> | null,
      rpcEndpoints: null as Promise<[RpcEndpointsResponse, RpcFavoriteEndpointsResponse]> | null,
      publicRpcEndpoints: null as Promise<RpcEndpointsResponse> | null,
    },
    service: {
      loading: false,
      search: '',
    },
    serviceTypes: [] as ServiceTypeInterface[],
    services: [] as ServiceInterface[],
  }),
  getters: {
    hasProjects(state) {
      return Array.isArray(state.project.items) && state.project.items.length > 0;
    },
    hasProjectOverview(state) {
      return state.project.overview && (state.project.overview.availableStorage || state.project.overview.usedStorage);
    },
    currentProject(state) {
      if (!this.hasProjects) {
        return null;
      }
      /** Return project with currentProjectUuid, if this ID does not exists, return first project */
      const project = state.project.items.find(project => project.project_uuid === state.project.selected);
      if (project) {
        return project;
      }

      /** Select first project as fallback if currentProjectUuid is not available */
      this.project.selected = state.project.items[0].project_uuid;
      localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, this.project.selected);
      return state.project.items[0];
    },
    projectUuid(state): string {
      return (
        state.project.active.project_uuid ||
        (
          state.project.items.find((item: ProjectInterface) => item.project_uuid === state.project.selected) ||
          ({} as ProjectInterface)
        )?.project_uuid ||
        ''
      );
    },
    myRoleOnProject(state) {
      return state.project.active.myRole_id_onProject || DefaultUserRole.PROJECT_USER;
    },
    isUserOwner(state): boolean {
      return state.project.active.myRole_id_onProject === DefaultUserRole.PROJECT_OWNER;
    },
    isUserAdmin(state): boolean {
      return state.project.active.myRole_id_onProject === DefaultUserRole.PROJECT_ADMIN;
    },
    isProjectUser(state): boolean {
      return state.project.active.myRole_id_onProject === DefaultUserRole.PROJECT_USER;
    },
  },
  actions: {
    resetData() {
      /** Project */
      this.project.active = {} as ProjectInterface;
      this.project.items = [] as Array<ProjectInterface>;
      this.project.overview = {} as ProjectOverviewInterface;
      this.project.quotaReached = undefined as boolean | undefined;
      /** Services */
      this.services = [] as Array<ServiceInterface>;
    },

    async waitOnPromises(delay = true) {
      if (delay) {
        await sleep(100);
      }
      await Promise.all(Object.values(this.promises));
    },

    isUser(type: number): boolean {
      return this.myRoleOnProject === type;
    },

    setCurrentProject(uuid: string) {
      /** Reset store data */
      this.resetData();
      this.project.selected = uuid;
      localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, uuid);
    },

    resetCurrentProject() {
      /** Reset store data */
      this.resetData();

      this.project.selected = null;
      localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);
    },

    updateCurrentProject(project: ProjectInterface) {
      /** Find index of specific object using findIndex method. */
      const projectIndex = this.project.items.findIndex(item => item.project_uuid === project.project_uuid);

      /** Update current project, add value and label, which are used in header dropdown */
      this.project.items[projectIndex] = {
        ...project,
        value: project.project_uuid,
        label: project.name,
      };
    },

    hasServices() {
      return Array.isArray(this.services) && this.services.length > 0;
    },

    hasServicesByType(type: number) {
      return Array.isArray(this.services) && this.services.some(item => item.serviceType_id === type);
    },

    hasServiceTypes() {
      return Array.isArray(this.serviceTypes) && this.serviceTypes.length > 0;
    },

    hasInstructions(key: string) {
      return key in this.instructions && Array.isArray(this.instructions[key]) && this.instructions[key].length > 0;
    },

    /**
     * Fetch wrappers
     */
    async getProjectUuid(): Promise<string> {
      await this.waitOnPromises(false);
      if (!this.hasProjects) {
        await this.fetchProjects();
      }
      return this.projectUuid;
    },

    async getProjects(redirectToDashboard: boolean = false) {
      if (!this.hasProjects || isCacheExpired(LsCacheKeys.PROJECTS)) {
        return await this.fetchProjects(redirectToDashboard);
      }
      return this.project.items;
    },

    async getProject(projectUuid: string): Promise<ProjectInterface> {
      if (this.project.active?.project_uuid === projectUuid && !isCacheExpired(LsCacheKeys.PROJECT)) {
        return this.project.active;
      }
      return await this.fetchProject(projectUuid);
    },

    /** GET Project quota, if current value is undefined  */
    async getProjectQuota() {
      if (this.project.quotaReached === undefined) {
        await this.fetchProjectsQuota();
      }
    },

    async getProjectOverview(projectUuid: string): Promise<ProjectOverviewInterface> {
      if (
        !this.hasProjectOverview ||
        this.project.active?.project_uuid !== projectUuid ||
        isCacheExpired(LsCacheKeys.PROJECT_OVERVIEW)
      ) {
        await this.fetchProjectOverview(projectUuid);
      }
      return this.project.overview;
    },

    /** Services */
    async getServiceTypes() {
      if (!this.hasServiceTypes() || isCacheExpired(LsCacheKeys.SERVICE_TYPES)) {
        this.serviceTypes = await this.fetchServiceTypes();
      }
      return this.serviceTypes;
    },
    async getServices() {
      this.getServiceTypes();

      if (!this.hasServices() || isCacheExpired(LsCacheKeys.SERVICES)) {
        this.services = await this.fetchServices();
      }
      return this.services;
    },
    async getServiceByType(type: number) {
      const services = await this.getServices();
      return services.find(item => item.serviceType_id === type);
    },
    async getServicesByType(type: number) {
      const services = await this.getServices();
      return services.filter(item => item.serviceType_id === type);
    },

    /**
     * API calls
     */

    /** Projects */
    async fetchProjects(redirectToDashboard: boolean = false): Promise<ProjectInterface[]> {
      const router = useRouter();

      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();

      try {
        this.promises.projects = $api.get<ProjectsResponse>(endpoints.projectsUserProjects, undefined, {
          signal: abortController.signal,
        });
        const res = await this.promises.projects;
        const hasProjects = res.data.total > 0;

        this.project.items = res.data.items.map((project: ProjectInterface) => {
          return {
            ...project,
            value: project.project_uuid,
            label: project.name,
          };
        });

        if (this.project.selected && !this.project.items.some(i => i.project_uuid === this.project.selected)) {
          this.project.selected = null;
        }

        /* If current project is not selected, take first one */
        if (hasProjects && !this.project.selected) {
          this.project.selected = this.project.items[0].project_uuid;
          localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, this.project.items[0].project_uuid);
        }

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.PROJECTS, Date.now().toString());

        /** If user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
        if (redirectToDashboard && !hasProjects) {
          router.push({ name: 'dashboard' });
          this.project.showOnboarding = true;
          sessionStorage.setItem(DataLsKeys.ONBOARDING, Date.now().toString());
        } else if (redirectToDashboard) {
          router.push({ name: 'dashboard' });
        }

        return this.project.items;
      } catch (error: any) {
        if (!(error instanceof DOMException) && error.message !== 'The user aborted a request.') {
          /** Clear promise */
          this.promises.projects = null;
          this.project.items = [];

          /** Show error message */
          window.$message.error(userFriendlyMsg(error));
        }
      }
      return [];
    },

    async fetchProject(projectUuid?: string): Promise<ProjectInterface> {
      const uuid = projectUuid || this.projectUuid;
      if (!uuid) {
        return {} as ProjectInterface;
      }
      try {
        const res = await $api.get<ProjectResponse>(endpoints.project(uuid));
        this.project.active = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.PROJECT, Date.now().toString());

        return res.data;
      } catch (error: ApiError | any) {
        this.project.active = {} as ProjectInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as ProjectInterface;
    },

    async fetchProjectsQuota() {
      try {
        const res = await $api.get<BooleanResponse>(endpoints.projectsQuota);
        this.project.quotaReached = res.data;
      } catch (error: any) {
        this.project.quotaReached = undefined;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    async fetchProjectOverview(projectUuid?: string): Promise<ProjectOverviewInterface> {
      await this.waitOnPromises();

      const uuid = projectUuid || this.projectUuid;
      if (!uuid) {
        return {} as ProjectOverviewInterface;
      }
      try {
        const res = await $api.get<ProjectOverviewResponse>(endpoints.projectOverview(uuid));
        this.project.overview = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.PROJECT_OVERVIEW, Date.now().toString());

        return res.data;
      } catch (error: ApiError | any) {
        this.project.overview = {} as ProjectOverviewInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as ProjectOverviewInterface;
    },

    /** Services */
    async fetchServices() {
      await this.waitOnPromises();
      if (!this.projectUuid) {
        return [] as Array<ServiceInterface>;
      }
      this.service.loading = true;

      try {
        const params: Record<string, string | number> = {
          uuid: this.projectUuid,
          project_uuid: this.projectUuid,
          ...PARAMS_ALL_ITEMS,
        };
        const res = await $api.get<ServicesResponse>(endpoints.services(), params);
        this.service.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SERVICES, Date.now().toString());

        return res.data.items
          .filter(item => item.status === SqlModelStatus.ACTIVE)
          .map((service: ServiceInterface, key: number) => {
            return { key, ...service };
          });
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      this.service.loading = false;
      return [] as Array<ServiceInterface>;
    },

    async fetchServiceTypes() {
      try {
        const res = await $api.get<ServiceTypesResponse>(endpoints.serviceTypes);

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SERVICE_TYPES, Date.now().toString());

        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return [] as Array<ServiceTypeInterface>;
    },
  },
});
