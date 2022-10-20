import { defineStore } from 'pinia';

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
    promises: {
      projects: null,
    },
  }),
  getters: {
    currentProject(state) {
      return state.projects[state.currentProjectId] || null;
    },
  },
  actions: {},
});
