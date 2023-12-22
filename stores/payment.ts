import { defineStore } from 'pinia';

type FetchCreditTransactionsParams = FetchParams & {
  service: string | null;
  category: string | null;
  direction: string | null;
};

let abortController = null as AbortController | null;

export const usePaymentStore = defineStore('payment', {
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
    loading: false,
    priceList: [] as ProductPriceInterface[],
  }),
  getters: {
    hasCustomerPortalUrl(state) {
      return !!state?.customerPortalUrl;
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
      this.creditTransactions.items = [] as CreditTransactionInterface[];
      this.creditTransactions.total = 0;
      this.activeSubscription = {} as SubscriptionInterface;
      this.subscriptions = [] as SubscriptionInterface[];
      this.invoices.items = [] as InvoiceInterface[];
      this.invoices.total = 0;
      this.priceList = [] as ProductPriceInterface[];
    },

    async getProjectUuid(): Promise<string> {
      const dataStore = useDataStore();
      if (!dataStore.hasProjects) {
        await dataStore.fetchProjects();
      }
      return dataStore.projectUuid;
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
    async getInvoices(page?: number, limit?: number) {
      if (page || limit || !this.hasInvoices || isCacheExpired(LsCacheKeys.INVOICES)) {
        const invoiceData = await this.fetchInvoices(page, limit);

        if (invoiceData?.data) {
          this.invoices.items = invoiceData.data.items;
          this.invoices.total = invoiceData.data.total;
        } else {
          this.invoices.items = [] as InvoiceInterface[];
          this.invoices.total = 0;
        }
      }
    },

    /** GET Price list */
    async getPriceList() {
      if (!this.hasPriceList) {
        await this.fetchProductPriceList();
      }
      return this.priceList;
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

    /** Price for service */
    findServicePrice(serviceName: string) {
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
      const projectUuid = await this.getProjectUuid();
      if (!projectUuid) return;

      try {
        const res = await $api.get<CreditResponse>(endpoints.credit(projectUuid));

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
    async fetchCreditTransactions(args?: FetchCreditTransactionsParams = {}) {
      const projectUuid = await this.getProjectUuid();
      if (!projectUuid) return;

      try {
        const params = parseArguments(args);
        if (args.category) params.category = args.category;
        if (args.direction) params.direction = args.direction;
        if (args.service) params.service = args.service;

        const res = await $api.get<CreditTransactionsResponse>(
          endpoints.creditTransactions(projectUuid),
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
      this.loading = true;
      const projectUuid = await this.getProjectUuid();
      if (!projectUuid) return;

      try {
        const res = await $api.get<ActiveSubscriptionResponse>(
          endpoints.activeSubscription(projectUuid)
        );

        this.activeSubscription = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SUBSCRIPTION_ACTIVE, Date.now().toString());
      } catch (error: any) {
        this.activeSubscription = {} as SubscriptionInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
    },

    /** API Subscriptions */
    async fetchSubscriptions() {
      const projectUuid = await this.getProjectUuid();
      if (!projectUuid) return;

      try {
        const res = await $api.get<SubscriptionsResponse>(endpoints.subscriptions(projectUuid));

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
    async fetchInvoices(
      page = 1,
      limit: number = PAGINATION_LIMIT
    ): Promise<InvoiceResponse | null> {
      const projectUuid = await this.getProjectUuid();
      if (!projectUuid) {
        return null;
      }

      try {
        const params: Record<string, string | number> = {
          orderBy: 'createTime',
          desc: 'true',
          reference: 'creditPackage',
          page,
          limit,
        };

        const res = await $api.get<InvoiceResponse>(endpoints.invoices(projectUuid), params);

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.INVOICES, Date.now().toString());

        return res;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },

    /** API Stripe credit session URL */
    async fetchCreditSessionUrl(packageId: number) {
      const config = useRuntimeConfig();
      const projectUuid = await this.getProjectUuid();
      if (!projectUuid) return;

      try {
        const res = await $api.get<GeneralResponse<string>>(endpoints.creditSessionUrl, {
          project_uuid: projectUuid,
          package_id: packageId,
          returnUrl: `${config.public.url}/dashboard/payments?credits=${packageId}`,
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
      const route = useRoute();
      const config = useRuntimeConfig();
      const projectUuid = await this.getProjectUuid();
      if (!projectUuid) return;

      try {
        const res = await $api.get<GeneralResponse<string>>(endpoints.subscriptionSessionUrl, {
          project_uuid: projectUuid,
          package_id: packageId,
          returnUrl: `${config.public.url}${route.path}?subscription=${packageId}`,
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
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();

      try {
        const res = await $api.get<PriceListResponse>(endpoints.productPrice(), undefined, {
          signal: abortController.signal,
        });

        this.priceList = res.data.items;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.PRICE_LIST, Date.now().toString());
      } catch (error: any) {
        if (!(error instanceof DOMException) && error.message !== 'The user aborted a request.') {
          this.priceList = [];

          /** Show error message */
          window.$message.error(userFriendlyMsg(error));
        }
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
