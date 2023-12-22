export enum TransactionCategory {
  COLLECTION = 'COLLECTION',
  DEPLOYMENT = 'DEPLOYMENT',
  INVOICE = 'INVOICE',
  PROJECT = 'PROJECT',
  PROMO_CODE = 'PROMO_CODE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  TRANSACTION = 'TRANSACTION',
  IDENTITY = 'IDENTITY',
  WEBSITE = 'WEBSITE',
}
export enum CreditDirection {
  RECEIVE = 1,
  SPEND = 2,
}
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
    price: number | null;
    description: string;
    services: PricingService;
    otherServices: String[];
  };

  /**
   * Credit
   */
  interface CreditInterface extends GeneralInterface {
    project_uuid: string;
    balance: number | null;
  }
  interface CreditResponse extends GeneralResponse<CreditInterface> {}

  interface CreditTransactionInterface extends BaseObjectInterface {
    amount: number;
    category: string;
    credit_id: number;
    direction: number;
    product_id: number;
    createTime: string;
    referenceId: string | null;
    referenceTable: string | null;
    service: string;
  }
  interface CreditTransactionsResponse extends GeneralItemsResponse<CreditTransactionInterface> {}

  /**
   * Credit Packages
   */
  interface CreditPackageInterface extends BaseObjectInterface {
    id: number;
    bonusCredits: number;
    creditAmount: number;
    price: number;
  }
  interface CreditPackagesResponse extends GeneralResponse<CreditPackageInterface[]> {}

  /**
   * Subscription
   */
  interface SubscriptionInterface extends GeneralInterface {
    cancelDate: string;
    cancellationComment: string;
    cancellationReason: string;
    expiresOn: string;
    id: number;
    package_id: number;
    project_uuid: string;
  }
  interface ActiveSubscriptionResponse extends GeneralResponse<SubscriptionInterface> {}
  interface SubscriptionsResponse extends GeneralItemsResponse<SubscriptionInterface> {}

  /**
   * Subscription Package
   */
  interface SubscriptionPackageInterface extends BaseObjectInterface {
    id: number;
    creditAmount: number;
    price?: number;
  }
  interface SubscriptionPackagesResponse extends GeneralResponse<SubscriptionPackageInterface[]> {}

  /**
   * Invoice
   */
  interface InvoiceInterface extends GeneralInterface {
    project_uuid: string;
    clientEmail: string;
    clientName: string;
    currency: string;
    subtotalAmount: number;
    totalAmount: number;
    referenceTable: string | null;
    createTime: string | null;
  }
  interface InvoiceResponse extends GeneralItemsResponse<InvoiceInterface> {}

  /**
   * Product price
   */
  interface ProductPriceInterface extends BaseObjectInterface {
    category: string;
    service: string;
    currentPrice: number;
  }
  interface ProductPriceResponse extends GeneralResponse<ProductPriceInterface> {}
  interface PriceListResponse extends GeneralItemsResponse<ProductPriceInterface> {}
}
