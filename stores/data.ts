import { useMessage } from 'naive-ui';
import { defineStore } from 'pinia';
import { InstructionInterface, ProjectInterface, ProjectResponse } from '~~/types/data';
import { ServicesInterface, ServicesResponse } from '~~/types/service';

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
      if (state.currentProjectId === 0 && state.projects && state.projects.length > 0) {
        this.setCurrentProject(state.projects[0].id);
      }
      return state.projects.find(project => project.id === state.currentProjectId);
    },
  },
  actions: {
    setCurrentProject(id: number) {
      this.currentProjectId = id;
      localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, `${id}`);
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
        const { response, data, error } = await $api.get<ProjectResponse>(ProjectEndpoint.project);

        if (error) {
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
        if (this.currentProjectId === 0) {
          this.setCurrentProject(this.projects[0].id);
        }

        /** If user hasn't any project redirect him to '/login/first' so he will be able to create first project */
        if (redirectToDashboard && this.projects.length === 0) {
          router.push('/login/first');
        } else if (redirectToDashboard) {
          router.push('/');
        }

        return response;
      } catch (error) {
        // message.error(t('error.API'));
      }
    },

    async getServices(type: number) {
      const message = useMessage();
      try {
        const params = {
          project_id: this.currentProjectId,
          serviceType_id: type,
        };
        const { data, error } = await $api.get<ServicesResponse>(ServiceEndpoint.services, params);

        if (error) {
          message.error(error.message);
          return [];
        }

        return data.data.items.map((service: ServicesInterface, key: number) => {
          return { key, ...service };
        });
      } catch (error) {
        // message.error(t('error.API'));
      }
    },
  },
});
