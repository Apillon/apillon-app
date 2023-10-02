export {};

declare global {
  /**
   * Pricing
   */
  type PricingService = {
    identity?: string;
    storage: string;
    bandwith: string;
    hosting?: string;
    smartContracts?: string;
    credits: string;
  };
  type PricingPlan = {
    name: string;
    price: number;
    description: string;
    services: PricingService;
    otherServices: String[];
  };

  /**
   * Credit
   */
  interface CreditInterface extends GeneralInterface {
    project_uuid: string;
    balance: number;
  }
  interface CreditResponse extends GeneralResponse<CreditInterface> {}

  interface CreditTransactionInterface extends BaseObjectInterface {
    amount: number;
    credit_id: number;
    direction: number;
    product_id: number;
    referenceId: string | null;
    referenceTable: string | null;
  }
  interface CreditTransactionsResponse extends GeneralItemsResponse<CreditTransactionInterface> {}

  /**
   * Credit Packages
   */
  interface CreditPackageInterface extends BaseObjectInterface {
    creditAmount: number;
    bonusCredits: number;
  }
  interface CreditPackagesResponse extends GeneralResponse<CreditPackageInterface[]> {}

  /**
   * Subscription
   */
  interface SubscriptionInterface extends GeneralInterface {
    package_id: number;
    project_uuid: string;
    expiresOn: string;
    cancelDate: string;
    subscriberEmail: string;
    stripeId: string;
  }
  interface ActiveSubscriptionResponse extends GeneralResponse<SubscriptionInterface> {}
  interface SubscriptionsResponse extends GeneralItemsResponse<SubscriptionInterface> {}

  /**
   * Subscription Package
   */
  interface SubscriptionPackageInterface extends BaseObjectInterface {}
  interface SubscriptionPackagesResponse extends GeneralResponse<SubscriptionPackageInterface[]> {}

  /**
   * Invoice
   */
  interface InvoiceInterface extends GeneralInterface {
    project_uuid: string;
    referenceTable: string;
    referenceId: number;
    clientEmail: string;
    clientName: string;
    currency: string;
    subtotalAmount: number;
    totalAmount: number;
  }
  interface InvoiceResponse extends GeneralItemsResponse<InvoiceInterface> {}
}
