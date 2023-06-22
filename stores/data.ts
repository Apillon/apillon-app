import { defineStore } from 'pinia';
import { ServiceType, ServiceTypeName, ServiceTypeNames } from '~~/types/service';

export const DataLsKeys = {
  CURRENT_PROJECT_ID: 'al_current_project_uuid',
};

export const useDataStore = defineStore('data', {
  state: () => ({
    instruction: {} as Record<string, InstructionInterface>,
    instructions: {} as Record<string, Array<InstructionInterface>>,
    project: {
      active: {} as ProjectInterface,
      items: [] as Array<ProjectInterface>,
      selected: localStorage.getItem(DataLsKeys.CURRENT_PROJECT_ID) || '',
      quotaReached: undefined as Boolean | undefined,
    },
    promises: {
      projects: null as any,
      buckets: null as any,
      websites: null as any,
      collections: null as any,
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
    currentProject(state) {
      if (!this.hasProjects) {
        return null;
      }
      /** Return project with currentProjectUuid, if this ID does not exists, return first project */
      const project = state.project.items.find(
        project => project.project_uuid === state.project.selected
      );
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
          state.project.items.find(
            (item: ProjectInterface) => item.project_uuid === state.project.selected
          ) || ({} as ProjectInterface)
        )?.project_uuid ||
        ''
      );
    },
    myRoleOnProject(state) {
      return state.project.active.myRole_id_onProject || DefaultUserRole.PROJECT_USER;
    },
  },
  actions: {
    resetData() {
      /** Project */
      this.project.active = {} as ProjectInterface;
      this.project.items = [] as Array<ProjectInterface>;
      this.project.quotaReached = undefined as Boolean | undefined;
      /** Services */
      this.services = [] as Array<ServiceInterface>;
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

      this.project.selected = '';
      localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);
    },

    updateCurrentProject(project: ProjectInterface) {
      /** Find index of specific object using findIndex method. */
      const projectIndex = this.project.items.findIndex(
        item => item.project_uuid === project.project_uuid
      );

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

    hasServiceTypes() {
      return Array.isArray(this.serviceTypes) && this.serviceTypes.length > 0;
    },

    hasInstructions(key: string) {
      return (
        key in this.instructions &&
        Array.isArray(this.instructions[key]) &&
        this.instructions[key].length > 0
      );
    },

    /**
     * Fetch wrappers
     */
    async getProjects(redirectToDashboard: boolean = false) {
      if (!this.hasProjects || isCacheExpired(LsCacheKeys.PROJECTS)) {
        return await this.fetchProjects(redirectToDashboard);
      }
      return this.project.items;
    },

    async getProject(projectUuid: string): Promise<ProjectInterface> {
      if (
        this.project.active?.project_uuid === projectUuid &&
        !isCacheExpired(LsCacheKeys.PROJECT)
      ) {
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
      try {
        const req = $api.get<ProjectsResponse>(endpoints.projectsUserProjects);
        this.promises.projects = req;
        const res = await req;

        const projects = res.data.items.map((project: ProjectInterface) => {
          return {
            ...project,
            value: project.project_uuid,
            label: project.name,
          };
        });
        this.project.items = projects;
        const hasProjects = res.data.total > 0;

        /* If current project is not selected, take first one */
        if (this.project.selected === '' && hasProjects) {
          this.setCurrentProject(this.project.items[0].project_uuid);
        }

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.PROJECTS, Date.now().toString());

        /** If user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
        if (redirectToDashboard && !hasProjects) {
          router.push({ name: 'onboarding' });
        } else if (redirectToDashboard) {
          router.push({ name: 'dashboard' });
        }

        return projects;
      } catch (error) {
        /** Clear promise */
        this.promises.projects = null;

        this.project.items = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
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
      } catch (error) {
        this.project.active = {} as ProjectInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as ProjectInterface;
    },

    async fetchProjectsQuota() {
      try {
        const res = await $api.get<ProjectsQuotaResponse>(endpoints.projectsQuota);
        this.project.quotaReached = res.data;
      } catch (error: any) {
        this.project.quotaReached = undefined;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** Services */
    async fetchServices() {
      if (!this.hasProjects) {
        await this.fetchProjects();
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
          .filter(item => item.status === 5)
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

    /**
     * Instructions
     */
    async fetchInstruction(key: string) {
      try {
        const res = await $api.get<InstructionResponse>(endpoints.instructions(key));

        if (res.data) {
          this.instruction[key] = res.data;
        }
      } catch (error) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },
    async fetchInstructions(key: string) {
      try {
        const res = await $api.get<InstructionsResponse>(endpoints.instructions(), {
          forRoute: key,
        });

        if (res.data) {
          this.instructions[key] = res.data.items;
        } else {
          this.instructions[key] = [];
        }
      } catch (error) {
        this.instructions[key] = [];
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },
  },
});
