import { defineStore } from 'pinia';

export const useWarningStore = defineStore('warning', {
  state: () => ({
    action: (() => {}) as Function,
    isSpendingWarningOpen: false,
    services: [] as string[],
  }),

  actions: {
    async showSpendingWarning(serviceNames: string | string[], action: Function) {
      this.services = Array.isArray(serviceNames) ? serviceNames : [serviceNames];
      this.action = action;

      const paymentStore = usePaymentStore();
      const servicePrices = await paymentStore.filterServicePrice(this.services);

      console.log(serviceNames);
      console.log(this.services);
      console.log(servicePrices);
      console.log(sumCredits(servicePrices));
      if (servicePrices.length && sumCredits(servicePrices) > 0) {
        this.isSpendingWarningOpen = true;
      } else {
        action();
      }

      /** Remove timestamp for deleted items */
      sessionStorage.removeItem(LsCacheKeys.CREDITS);
    },
  },
});

export const sumCredits = (servicePrices: ProductPriceInterface[]) => {
  return servicePrices.reduce((acc, servicePrice) => acc + (servicePrice?.currentPrice || 0), 0);
};
