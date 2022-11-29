import { useMessage } from 'naive-ui';
import { defineStore } from 'pinia';
import { ServiceType, ServiceTypeName, ServiceTypeNames } from '~~/types/service';

export const DataLsKeys = {
  CURRENT_PROJECT_ID: 'al_current_project_id',
};

export const useDataStore = defineStore('data', {
  state: () => ({
    currentProjectId: localStorage.getItem(DataLsKeys.CURRENT_PROJECT_ID)
      ? parseInt(`${localStorage.getItem(DataLsKeys.CURRENT_PROJECT_ID)}`)
      : 0,
    projects: [] as Array<ProjectInterface>,
    services: {
      authentication: [] as Array<ServiceInterface>,
      storage: [] as Array<ServiceInterface>,
      bucket: [] as Array<BucketInterface>,
      computing: [] as Array<ServiceInterface>,
    } as Record<ServiceTypeName, any>,
    instruction: {} as Record<string, InstructionInterface>,
    instructions: {} as Record<string, Array<InstructionInterface>>,
    promises: {
      projects: null as any,
    },
  }),
  getters: {
    currentProject(state) {
      if (!this.hasProjects) {
        return null;
      }
      /** Return project with currentProjectId, if this ID does not exists, return first project */
      const project = state.projects.find(project => project.id === state.currentProjectId);
      if (project) {
        return project;
      }
      /** Select first project as fallback if currentProjectId is not available */
      this.currentProjectId = state.projects[0].id;
      localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, `${this.currentProjectId}`);
      return state.projects[0];
    },
    hasProjects(state) {
      return Array.isArray(state.projects) && state.projects.length > 0;
    },
  },
  actions: {
    setCurrentProject(id: number) {
      this.currentProjectId = id;
      localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, `${id}`);
    },

    updateCurrentProject(project: ProjectInterface) {
      /** Find index of specific object using findIndex method. */
      const projectIndex = this.projects.findIndex(item => item.id === project.id);

      /** Update current project, add value and label, which are used in header dropdown */
      this.projects[projectIndex] = {
        ...project,
        value: project.id,
        label: project.name,
      };
    },

    getInstruction(key: string) {
      if (key in this.instruction) {
        return this.instruction[key];
      }
      return null;
    },

    async getProjects(redirectToDashboard: boolean = false, $i18n: any = null) {
      const message = useMessage();
      const router = useRouter();
      try {
        const res = await $api.get<ProjectResponse>(endpoints.userProjects);

        this.projects = res.data.items.map((project: ProjectInterface) => {
          return {
            ...project,
            value: project.id,
            label: project.name,
          };
        });

        /* If current project is not selected, take first one */
        if (this.currentProjectId === 0 && this.hasProjects) {
          this.setCurrentProject(this.projects[0].id);
        }

        /** If user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
        if (redirectToDashboard && !this.hasProjects) {
          router.push({ name: 'onboarding' });
        } else if (redirectToDashboard) {
          router.push({ name: 'dashboard' });
        }

        return res;
      } catch (error) {
        this.projects = [];
        message.error(userFriendlyMsg(error, $i18n));
      }
      return null;
    },

    hasServices(type: number) {
      const key: ServiceTypeName = ServiceTypeNames[type];
      return Array.isArray(this.services[key]) && this.services[key].length > 0;
    },

    async getServices(type: number, $i18n: any = null) {
      if (!this.hasProjects) {
        alert('Please create your first project');
        return [] as Array<ServiceInterface>;
      }

      const message = useMessage();
      try {
        const params = {
          project_id: this.currentProjectId,
          serviceType_id: type,
        };
        const res = await $api.get<ServicesResponse>(endpoints.services, params);

        return res.data.items.map((service: ServiceInterface, key: number) => {
          return { key, ...service };
        });
      } catch (error: any) {
        message.error(userFriendlyMsg(error, $i18n));
      }
      return [] as Array<ServiceInterface>;
    },

    async getAuthServices($i18n: any = null) {
      this.services.authentication = await this.getServices(ServiceType.AUTHENTICATION, $i18n);
    },
    async getStorageServices($i18n: any = null) {
      this.services.storage = await this.getServices(ServiceType.STORAGE, $i18n);
    },
    async getComputingServices($i18n: any = null) {
      this.services.computing = await this.getServices(ServiceType.COPMUTING, $i18n);
    },

    async getBuckets($i18n: any = null) {
      if (!this.hasProjects) {
        alert('Please create your first project');
        return;
      }

      const message = useMessage();
      try {
        const params = {
          project_uuid: this.currentProject?.project_uuid || '',
        };
        const res = await $api.get<BucketResponse>(endpoints.bucket, params);

        this.services.bucket = res.data.items.map((bucket: BucketInterface) => {
          return {
            ...bucket,
            sizeMb: kbToMb(bucket.size || 0),
            maxSizeMb: kbToMb(bucket.maxSize),
            percentage: storagePercantage(bucket.size || 0, bucket.maxSize),
          };
        });
      } catch (error: any) {
        this.services.bucket = [];
        message.error(userFriendlyMsg(error, $i18n));
      }
    },
  },
});
