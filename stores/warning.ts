import { defineStore } from 'pinia';

export const useWarningStore = defineStore('warning', {
  state: () => ({
    action: (() => {}) as Function,
    isSpendingWarningOpen: false,
    serviceName: '',
  }),

  actions: {
    showSpendingWarning(serviceName: string, action: Function) {
      this.isSpendingWarningOpen = true;
      this.serviceName = serviceName;
      this.action = action;

      /** Remove timestamp for deleted items */
      sessionStorage.removeItem(LsCacheKeys.CREDITS);
    },
  },
});
