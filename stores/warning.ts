import { defineStore } from 'pinia';

export const useWarningStore = defineStore('warning', {
  state: () => ({
    action: (() => {}) as Function,
    isSpendingWarningOpen: false,
    serviceName: '',
  }),

  actions: {
    showSpendingWarning(serviceName: string, action: Function) {
      this.serviceName = serviceName;
      this.action = action;

      const paymentStore = usePaymentStore();
      const servicePrice = paymentStore.findServicePrice(serviceName);
      if (servicePrice && servicePrice?.currentPrice > 0) {
        this.isSpendingWarningOpen = true;
      }

      /** Remove timestamp for deleted items */
      sessionStorage.removeItem(LsCacheKeys.CREDITS);
    },
  },
});
