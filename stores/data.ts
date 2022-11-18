import { useMessage } from 'naive-ui';
import { defineStore } from 'pinia';
import { InstructionInterface, ProjectInterface, ProjectResponse } from '~~/types/data';
import {
  BucketInterface,
  BucketResponse,
  ServicesInterface,
  ServicesResponse,
} from '~~/types/service';
import { kbToMb } from '~~/lib/utils';
import { $api } from '~~/lib/api';

export const DataLsKeys = {
  CURRENT_PROJECT_ID: 'al_current_project_id',
  PROJECTS: 'al_projects',
  SERVICES: 'al_services',
};

export const useDataStore = defineStore('data', {
  state: () => ({
    currentProjectId: localStorage.getItem(DataLsKeys.CURRENT_PROJECT_ID)
      ? parseInt(localStorage.getItem(DataLsKeys.CURRENT_PROJECT_ID))
      : 0,
    projects: [] as Array<ProjectInterface>,
    services: {
      authentication: [],
      bucket: [],
      storage: [],
      computing: [],
    },
    instruction: {} as Record<string, InstructionInterface>,
    instructions: {} as Record<string, Array<InstructionInterface>>,
    promises: {
      projects: null,
    },
  }),
  getters: {
    currentProject(state) {
      /** Select first project as fallback if project is not selected */
      if (state.currentProjectId === 0 && this.hasProjects) {
        this.setCurrentProject(state.projects[0].id);
      }
      return state.projects.find(project => project.id === state.currentProjectId);
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

    async getProjects(redirectToDashboard: boolean = false) {
      const message = useMessage();
      const router = useRouter();
      try {
        const { response, data, error } = await $api.get<ProjectResponse>(endpoints.userProjects);

        if (error) {
          console.log('error');
          console.log(error);
          message.error(error.message);

          this.projects = [];
        }

        this.projects = data.data.items.map((project: ProjectInterface) => {
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

        return response;
      } catch (error) {
        console.log('catch error');
        console.log(error);
        message.error(error);
        // message.error(t('error.API'));
      }
      return null;
    },

    async getServices(type: number) {
      const message = useMessage();
      try {
        const params = {
          project_id: this.currentProjectId,
          serviceType_id: type,
        };
        const { data, error } = await $api.get<ServicesResponse>(endpoints.services, params);

        if (error) {
          message.error(error.message);
          return [];
        }

        return data.data.items.map((service: ServicesInterface, key: number) => {
          return { key, ...service };
        });
      } catch (error) {
        message.error(error);
      }
    },

    async getBuckets() {
      const message = useMessage();
      try {
        const params = {
          project_uuid: this.currentProject.project_uuid,
        };
        const { data, error } = await $api.get<BucketResponse>(endpoints.bucket, params);

        if (error) {
          message.error(error.message);
          this.services.bucket = [];
        }

        this.services.bucket = data.data.items.map((bucket: BucketInterface) => {
          return {
            ...bucket,
            sizeMb: kbToMb(bucket.size),
            maxSizeMb: kbToMb(bucket.maxSize),
            percentage: storagePercantage(bucket.size, bucket.maxSize),
          };
        });
      } catch (error) {
        this.services.bucket = [];
        message.error(error);
        // message.error(t('error.API'));
      }
    },
  },
});
