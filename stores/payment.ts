import { defineStore } from 'pinia';

const dataStore = useDataStore();

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    credit: {} as CreditInterface,
    creditTransactions: [] as CreditTransactionInterface[],
    activeSubscription: {} as SubscriptionInterface,
    subscriptions: [] as SubscriptionInterface[],
    invoices: [] as InvoiceInterface[],
  }),
  getters: {},
  actions: {
    resetData() {
      this.credit = {} as CreditInterface;
      this.transactions = [] as CreditTransactionInterface[];
      this.activeSubscription = {} as SubscriptionInterface;
      this.subscriptions = [] as SubscriptionInterface[];
      this.invoices = [] as InvoiceInterface[];
    },

    /**
     *
     * API calls
     */

    /** API Credit */
    async getCredit() {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<CreditResponse>(endpoints.credit(dataStore.projectUuid));

        this.credit = res.data;
      } catch (error: any) {
        this.credit = {} as CreditInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Credit transactions */
    async getCreditTransactions() {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<CreditTransactionsResponse>(
          endpoints.creditTransactions(dataStore.projectUuid)
        );

        this.creditTransactions = res.data.items;
      } catch (error: any) {
        this.creditTransactions = [] as CreditTransactionInterface[];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Active Subscription */
    async getActiveSubscription() {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<ActiveSubscriptionResponse>(
          endpoints.activeSubscription(dataStore.projectUuid)
        );

        this.activeSubscription = res.data;
      } catch (error: any) {
        this.activeSubscription = {} as SubscriptionInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Subscriptions */
    async getSubscriptions() {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<SubscriptionsResponse>(
          endpoints.subscriptions(dataStore.projectUuid)
        );

        this.subscriptions = res.data.items;
      } catch (error: any) {
        this.subscriptions = [] as SubscriptionInterface[];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Invoices */
    async getInvoices() {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<InvoiceResponse>(endpoints.invoices(dataStore.projectUuid));

        this.invoices = res.data.items;
      } catch (error: any) {
        this.invoices = [] as InvoiceInterface[];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Stripe credit session URL */
    async getCreditSessionUrl(packageId: number) {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<GeneralResponse<any>>(endpoints.creditSessionUrl, {
          project_uuid: dataStore.projectUuid,
          package_id: packageId,
        });
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Stripe subscription session URL */
    async getSubscriptionSessionUrl(packageId: number) {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<GeneralResponse<any>>(endpoints.subscriptionSessionUrl, {
          project_uuid: dataStore.projectUuid,
          package_id: packageId,
        });
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Stripe subscribe */
    async getStripeSubscribe() {
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.post<GeneralResponse<any>>(endpoints.stripeWebhook);
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },
  },
});
