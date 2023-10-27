import { defineStore } from 'pinia';

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    customerPortalUrl: '',
    credit: {} as CreditInterface,
    creditPackages: [] as CreditPackageInterface[],
    creditTransactions: {
      items: [] as CreditTransactionInterface[],
      total: 0,
    },
    activeSubscription: {} as SubscriptionInterface,
    subscriptions: [] as SubscriptionInterface[],
    subscriptionPackages: [] as SubscriptionPackageInterface[],
    invoices: {
      items: [] as InvoiceInterface[],
      total: 0,
    },
    priceList: [] as ProductPriceInterface[],
  }),
  getters: {
    hasCustomerPortalUrl(state) {
      return Array.isArray(state.customerPortalUrl) && state.customerPortalUrl.length > 0;
    },
    hasCredits(state) {
      return state.credit?.balance;
    },
    hasCreditPackages(state) {
      return Array.isArray(state.creditPackages) && state.creditPackages.length > 0;
    },
    hasActiveSubscription(state) {
      return state.activeSubscription?.package_id;
    },
    hasSubscriptionPackages(state) {
      return Array.isArray(state.subscriptionPackages) && state.subscriptionPackages.length > 0;
    },
    hasInvoices(state) {
      return Array.isArray(state.invoices) && state.invoices.length > 0;
    },
    hasPriceList(state) {
      return Array.isArray(state.priceList) && state.priceList.length > 0;
    },
    getActiveSubscriptionPackage(state) {
      return (
        state.subscriptionPackages.find(item => item.id === state.activeSubscription.package_id) ||
        state.subscriptionPackages[0]
      );
    },
  },
  actions: {
    resetData() {
      this.credit = {} as CreditInterface;
      this.creditPackages = [] as CreditPackageInterface[];
      this.creditTransactions.items = [] as CreditTransactionInterface[];
      this.creditTransactions.total = 0;
      this.activeSubscription = {} as SubscriptionInterface;
      this.subscriptions = [] as SubscriptionInterface[];
      this.subscriptionPackages = [] as SubscriptionPackageInterface[];
      this.invoices.items = [] as InvoiceInterface[];
      this.invoices.total = 0;
      this.priceList = [] as ProductPriceInterface[];
    },

    /**
     * Fetch wrappers
     */
    /** GET Customer portal URL */
    async getCustomerPortalURL(): Promise<string> {
      if (!this.hasCustomerPortalUrl || isCacheExpired(LsCacheKeys.CUSTOMER_PORTAL_URL)) {
        await this.fetchCustomerPortalURL();
      }
      return this.customerPortalUrl;
    },

    /** GET Credits */
    async getCredits() {
      if (!this.hasCredits || isCacheExpired(LsCacheKeys.CREDITS)) {
        await this.fetchCredits();
      }
    },
    /** GET Credit Packages */
    async getCreditPackages() {
      if (!this.hasCreditPackages || isCacheExpired(LsCacheKeys.CREDIT_PACKAGES)) {
        await this.fetchCreditPackages();
      }
    },

    /** GET Active Subscription */
    async getActiveSubscription() {
      if (!this.hasActiveSubscription || isCacheExpired(LsCacheKeys.SUBSCRIPTION_ACTIVE)) {
        await this.fetchActiveSubscription();
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

    /** GET Price list */
    async getPriceList() {
      if (!this.hasPriceList || isCacheExpired(LsCacheKeys.PRICE_LIST)) {
        await this.fetchProductPriceList();
      }
    },

    /** GET Prices for service */
    async getServicePrices(service: string) {
      await this.getPriceList();

      return this.priceList.filter(item => item.service === service);
    },

    /** GET Price for service */
    async getServicePrice(serviceName: string) {
      await this.getPriceList();

      return this.priceList.find(item => item.name === serviceName);
    },

    /**
     *
     * API calls
     */

    /** API Customer portal URL */
    async fetchCustomerPortalURL() {
      try {
        const res = await $api.get<GeneralResponse<string>>(endpoints.customerPortalUrl);

        this.customerPortalUrl = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CUSTOMER_PORTAL_URL, Date.now().toString());
      } catch (error: any) {
        this.customerPortalUrl = '';

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Credit */
    async fetchCredits() {
      const dataStore = useDataStore();
      if (!dataStore.projectUuid) {
        return;
      }

      try {
        const res = await $api.get<CreditResponse>(endpoints.credit(dataStore.projectUuid));

        this.credit = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.CREDITS, Date.now().toString());
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
    async fetchCreditTransactions(page = 1, limit: number = PAGINATION_LIMIT) {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const params: Record<string, string | number> = {
          page,
          limit,
        };

        const res = await $api.get<CreditTransactionsResponse>(
          endpoints.creditTransactions(dataStore.projectUuid),
          params
        );

        this.creditTransactions.items = res.data.items;
        this.creditTransactions.total = res.data.total;
      } catch (error: any) {
        this.creditTransactions.items = [] as CreditTransactionInterface[];
        this.creditTransactions.total = 0;
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

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SUBSCRIPTION_ACTIVE, Date.now().toString());
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
    async fetchInvoices(page = 1, limit: number = PAGINATION_LIMIT) {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }

      try {
        const params: Record<string, string | number> = {
          page,
          limit,
        };

        const res = await $api.get<InvoiceResponse>(
          endpoints.invoices(dataStore.projectUuid),
          params
        );

        this.invoices.items = res.data.items;
        this.invoices.total = res.data.total;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.INVOICES, Date.now().toString());
      } catch (error: any) {
        this.invoices.items = [] as InvoiceInterface[];
        this.invoices.total = 0;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Stripe credit session URL */
    async fetchCreditSessionUrl(packageId: number) {
      const config = useRuntimeConfig();
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
      const config = useRuntimeConfig();
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

    /** API Product */
    async fetchProductPriceList() {
      try {
        const res = await $api.get<PriceListResponse>(endpoints.productPrice());

        this.priceList = res.data.items;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.PRICE_LIST, Date.now().toString());
      } catch (error: any) {
        this.priceList = [];

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },
    async fetchProductPrice(productId: number): Promise<ProductPriceInterface | null> {
      try {
        const res = await $api.get<ProductPriceResponse>(endpoints.productPrice(productId));
        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },
  },
});
