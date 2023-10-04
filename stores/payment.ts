import { defineStore } from 'pinia';

const config = useRuntimeConfig();

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    credit: {} as CreditInterface,
    creditPackages: [] as CreditPackageInterface[],
    creditTransactions: [] as CreditTransactionInterface[],
    activeSubscription: {} as SubscriptionInterface,
    subscriptions: [] as SubscriptionInterface[],
    subscriptionPackages: [] as SubscriptionPackageInterface[],
    invoices: [] as InvoiceInterface[],
  }),
  getters: {
    hasCreditPackages(state) {
      return Array.isArray(state.creditPackages) && state.creditPackages.length > 0;
    },
    hasSubscriptionPackages(state) {
      return Array.isArray(state.subscriptionPackages) && state.subscriptionPackages.length > 0;
    },
    hasInvoices(state) {
      return Array.isArray(state.invoices) && state.invoices.length > 0;
    },
  },
  actions: {
    resetData() {
      this.credit = {} as CreditInterface;
      this.creditPackages = [] as CreditPackageInterface[];
      this.creditTransactions = [] as CreditTransactionInterface[];
      this.activeSubscription = {} as SubscriptionInterface;
      this.subscriptions = [] as SubscriptionInterface[];
      this.subscriptionPackages = [] as SubscriptionPackageInterface[];
      this.invoices = [] as InvoiceInterface[];
    },

    /**
     * Fetch wrappers
     */
    /** GET Credit Packages */
    async getCreditPackages() {
      if (!this.hasCreditPackages || isCacheExpired(LsCacheKeys.CREDIT_PACKAGES)) {
        await this.fetchCreditPackages();
      }
    },

    /** GET Subscription packages */
    async getSubscriptionPackages() {
      if (!this.hasSubscriptionPackages || isCacheExpired(LsCacheKeys.SUBSCRIPTION_PACKAGES)) {
        await this.fetchSubscriptionPackages();
      }
    },

    /** GET Invoices */
    async getInvoices() {
      if (!this.hasInvoices || isCacheExpired(LsCacheKeys.INVOICES)) {
        await this.fetchInvoices();
      }
    },

    /**
     *
     * API calls
     */

    /** API Credit */
    async fetchCredit() {
      const dataStore = useDataStore();
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
    async fetchCreditPackages() {
      try {
        const res = await $api.get<CreditPackagesResponse>(endpoints.creditPackages);

        this.creditPackages = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CREDIT_PACKAGES, Date.now().toString());
      } catch (error: any) {
        this.creditPackages = [] as CreditPackageInterface[];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Credit transactions */
    async fetchCreditTransactions() {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<CreditTransactionsResponse>(
          endpoints.creditTransactions(dataStore.projectUuid),
          PARAMS_ALL_ITEMS
        );

        this.creditTransactions = res.data.items;
      } catch (error: any) {
        this.creditTransactions = [] as CreditTransactionInterface[];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Active Subscription */
    async fetchActiveSubscription() {
      const dataStore = useDataStore();
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
    async fetchSubscriptions() {
      const dataStore = useDataStore();
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

    /** API Subscription packages */
    async fetchSubscriptionPackages() {
      try {
        const res = await $api.get<SubscriptionPackagesResponse>(endpoints.subscriptionPackages);

        this.subscriptionPackages = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SUBSCRIPTION_PACKAGES, Date.now().toString());
      } catch (error: any) {
        this.subscriptionPackages = [] as SubscriptionPackageInterface[];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Invoices */
    async fetchInvoices() {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<InvoiceResponse>(
          endpoints.invoices(dataStore.projectUuid),
          PARAMS_ALL_ITEMS
        );

        this.invoices = res.data.items;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.INVOICES, Date.now().toString());
      } catch (error: any) {
        this.invoices = [] as InvoiceInterface[];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Stripe credit session URL */
    async fetchCreditSessionUrl(packageId: number) {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<GeneralResponse<string>>(endpoints.creditSessionUrl, {
          project_uuid: dataStore.projectUuid,
          package_id: packageId,
          returnUrl: `${config.public.url}/dashboard/billing`,
        });
        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },

    /** API Stripe subscription session URL */
    async fetchSubscriptionSessionUrl(packageId: number) {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const res = await $api.get<GeneralResponse<string>>(endpoints.subscriptionSessionUrl, {
          project_uuid: dataStore.projectUuid,
          package_id: packageId,
          returnUrl: `${config.public.url}/dashboard/billing`,
        });
        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },

    /** API Stripe subscribe */
    async stripeSubscribe() {
      try {
        const res = await $api.post<GeneralResponse<string>>(endpoints.stripeWebhook);
        console.log(res.data);
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },
  },
});
