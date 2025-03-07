import { defineStore } from 'pinia';
import { RpcPlanType } from '~/lib/types/rpc';

type FetchCreditTransactionsParams = FetchParams & {
  service?: string | null;
  category?: string | null;
  direction?: string | null;
};

let abortController = null as AbortController | null;

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    customerPortalUrl: '',
    credit: {} as CreditInterface,
    creditPackages: [] as CreditPackageInterface[],
    creditTransactions: {
      items: [] as CreditTransactionInterface[],
      loading: false,
      pagination: createPagination(),
    },
    activeSubscription: {} as SubscriptionInterface,
    subscriptions: [] as SubscriptionInterface[],
    subscriptionPackages: [] as SubscriptionPackageInterface[],
    invoices: {
      items: [] as InvoiceInterface[],
      loading: false,
      pagination: createPagination(),
    },
    loading: false,
    priceList: [] as ProductPriceInterface[],
    promises: {
      activeSubscription: null as any,
      priceList: null as any,
    },
    rpcPlan: undefined as RpcPlanType | undefined,
  }),
  getters: {
    hasRpcPlan(state) {
      return state.rpcPlan !== RpcPlanType.DISABLED;
    },
    isRpcPlanLoaded(state) {
      return state.rpcPlan !== undefined;
    },
    hasPaidRpcPlan(state) {
      return state.rpcPlan === RpcPlanType.PAID;
    },
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
      this.creditTransactions.pagination.itemCount = 0;
      this.creditTransactions.pagination.page = 1;

      this.activeSubscription = {} as SubscriptionInterface;
      this.subscriptions = [] as SubscriptionInterface[];

      this.invoices.items = [] as InvoiceInterface[];
      this.invoices.pagination.itemCount = 0;
      this.invoices.pagination.page = 1;

      this.priceList = [] as ProductPriceInterface[];
    },

    hasPlan(planName: string) {
      const activePackage =
        this.subscriptionPackages.find(item => item.id === this.activeSubscription.package_id) ||
        this.subscriptionPackages[0];
      return activePackage?.name === planName;
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
      if (!this.hasActiveSubscription || this.promises.activeSubscription) {
        await this.promises.activeSubscription;
      } else if (!this.hasActiveSubscription || isCacheExpired(LsCacheKeys.SUBSCRIPTION_ACTIVE)) {
        await this.fetchActiveSubscription();
      }
    },

    /** GET RPC Plan */
    async getRpcPlan() {
      if (this.rpcPlan === undefined || isCacheExpired(LsCacheKeys.RPC_PLAN)) {
        await this.fetchRpcPlan();
      }
      return this.rpcPlan;
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
          this.invoices.pagination.itemCount = invoiceData.data.total;
        } else {
          this.invoices.items = [] as InvoiceInterface[];
          this.invoices.pagination.itemCount = 0;
        }
      }
    },

    /** GET Price list */
    async getPriceList() {
      if (!this.hasPriceList && this.promises.priceList) {
        await this.promises.priceList;
      } else if (!this.hasPriceList) {
        await this.fetchProductPriceList();
      }
      return this.priceList;
    },

    /** GET Prices for service */
    async getServicePrices(service: string): Promise<ProductPriceInterface[]> {
      await this.getPriceList();
      return this.priceList.filter(item => item.service === service);
    },
    async getServicePricesByName(serviceName: string): Promise<ProductPriceInterface[]> {
      return this.priceList.filter(item => item.name === serviceName);
    },
    async getServicePricesByCategory(category: string): Promise<ProductPriceInterface[]> {
      return this.priceList.filter(item => item.category === category);
    },

    /** GET Price for service */
    async getServicePrice(serviceName: string): Promise<ProductPriceInterface | undefined> {
      await this.getPriceList();
      return this.priceList.find(item => item.name === serviceName);
    },

    /** Price for service */
    async findServicePrice(serviceName: string): Promise<ProductPriceInterface | undefined> {
      return this.priceList.find(item => item.name === serviceName);
    },
    async filterServicePrice(serviceNames: string[]): Promise<ProductPriceInterface[]> {
      await this.getPriceList();
      return await this.priceList.filter(item => serviceNames.includes(item.name));
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
      const projectUuid = await dataStore.getProjectUuid();
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
    async fetchCreditTransactions(args: FetchCreditTransactionsParams = {}) {
      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();
      if (!projectUuid) return;

      this.creditTransactions.loading = true;
      try {
        const params = parseArguments(args);
        if (args.category) params.category = args.category;
        if (args.direction) params.direction = args.direction;
        if (args.service) params.service = args.service;

        const res = await $api.get<CreditTransactionsResponse>(endpoints.creditTransactions(projectUuid), params);

        this.creditTransactions.items = res.data.items;
        this.creditTransactions.pagination.itemCount = res.data.total;
      } catch (error: any) {
        this.creditTransactions.items = [] as CreditTransactionInterface[];
        this.creditTransactions.pagination.itemCount = 0;
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      } finally {
        this.creditTransactions.loading = false;
      }
    },

    /** API Active Subscription */
    async fetchActiveSubscription() {
      this.loading = true;
      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();
      if (!projectUuid) return;

      try {
        this.promises.activeSubscription = await $api.get<ActiveSubscriptionResponse>(
          endpoints.activeSubscription(projectUuid)
        );
        const res = await this.promises.activeSubscription;

        this.activeSubscription = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.SUBSCRIPTION_ACTIVE, Date.now().toString());
      } catch (error: any) {
        this.activeSubscription = {} as SubscriptionInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      this.promises.activeSubscription = null;
      this.loading = false;
    },

    /** API Subscriptions */
    async fetchSubscriptions() {
      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();
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
    async fetchInvoices(page = 1, limit: number = PAGINATION_LIMIT): Promise<InvoiceResponse | null> {
      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();
      if (!projectUuid) {
        return null;
      }

      this.invoices.loading = true;
      try {
        const params = parseArguments({ page, limit });
        params.reference = 'creditPackage';

        const res = await $api.get<InvoiceResponse>(endpoints.invoices(projectUuid), params);
        this.invoices.loading = false;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.INVOICES, Date.now().toString());

        return res;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
        this.invoices.loading = false;
      }
      return null;
    },

    /** API Stripe credit session URL */
    async fetchCreditSessionUrl(packageId: number) {
      const config = useRuntimeConfig();
      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();
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

    async fetchRpcPlan() {
      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();

      if (!projectUuid) return;

      try {
        const res = await $api.get<GeneralResponse<RpcPlanType>>(endpoints.getRpcPlan(projectUuid));

        this.rpcPlan = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.RPC_PLAN, Date.now().toString());
      } catch (error: any) {
        this.rpcPlan = RpcPlanType.DISABLED;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    },

    /** API Stripe subscription session URL */
    async fetchSubscriptionSessionUrl(packageId: number) {
      const route = useRoute();
      const config = useRuntimeConfig();
      const dataStore = useDataStore();
      const projectUuid = await dataStore.getProjectUuid();
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
        this.promises.priceList = $api.get<PriceListResponse>(endpoints.productPrice(), PARAMS_ALL_ITEMS, {
          signal: abortController.signal,
        });
        const res = await this.promises.priceList;

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
      this.promises.priceList = null;
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

    /**
     * Crypto
     */

    /** API Crypto credit session URL */
    async fetchCryptoSessionUrl(packageId: number): Promise<CryptoSessionInterface | null> {
      const dataStore = useDataStore();
      const config = useRuntimeConfig();

      if (!dataStore.projectUuid) return null;

      try {
        const res = await $api.post<CryptoSessionResponse>(endpoints.crypto(), {
          project_uuid: dataStore.projectUuid,
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

    /** API Crypto payment */
    async fetchCryptoPayment(paymentId: number) {
      try {
        const res = await $api.get<CryptoSessionResponse>(endpoints.crypto(paymentId));
        return res.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },
  },
});
