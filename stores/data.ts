import { defineStore } from 'pinia';
import { InstructionInterface } from '~~/types/data';

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
    projects: [],
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
  },
});
