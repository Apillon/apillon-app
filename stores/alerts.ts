import { defineStore } from 'pinia';

export const useAlertsStore = defineStore({
  id: 'alerts',
  state: () => ({
    alerts: null as any,
  }),
  actions: {
    subscribe(newOauthTypes: any) {
      this.oauthTypes = newOauthTypes;
    },
    update() {},
  },
});
