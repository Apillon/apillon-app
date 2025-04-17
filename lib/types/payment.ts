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

export const PLAN_NAMES = {
  FREEMIUM: 'Egg',
  CATERPILLAR: 'Caterpillar',
  COCOON: 'Cocoon',
  BUTTERFLY: 'Butterfly',
};

declare global {
  /**
   * Pricing
   */
  type PricingService = {
    identity?: string;
    storage: string;
    bandwith: string;
    wallets: string;
    hosting?: string;
    smartContracts?: string;
    credits: string;
  };
  type PricingPlan = {
    name: string;
    price: number | null;
    description: string;
    services: PricingService;
  };

  /**
   * Credit
   */
  interface CreditInterface extends GeneralInterface {
    project_uuid: string;
    balance: number;
    threshold: number;
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

  /**
   * Crypto Session
   */
  interface CryptoSessionInterface {
    cancelUrl: string;
    created_at: string;
    id: number;
    invoice_url: string;
    ipn_callback_url: string;
    is_fee_paid_by_user: boolean;
    is_fixed_rate: boolean;
    order_description: string;
    order_id: string;
    partially_paid_url: string | null;
    pay_currency: string;
    payout_currency: string | null;
    price_amount: string;
    price_currency: string;
    success_url: string;
    token_id: string;
    updated_at: string;
  }
  interface CryptoPaymentInterface {
    actually_paid: number;
    burning_percent: string;
    created_at: string;
    invoice_id: number;
    order_description: string;
    order_id: string;
    outcome_amount: number;
    outcome_currency: string;
    pay_address: string;
    pay_amount: number;
    pay_currency: string;
    payin_extra_id: string | null;
    payin_hash: string | null;
    payment_id: number;
    payment_status: string;
    payout_hash: string | null;
    price_amount: number;
    price_currency: string;
    purchase_id: number;
    type: string;
    updated_at: string;
  }

  interface CryptoSessionResponse extends GeneralResponse<CryptoSessionInterface> {}
  interface CryptoPaymentResponse extends GeneralResponse<CryptoPaymentInterface> {}
}
