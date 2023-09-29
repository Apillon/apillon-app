export {};

declare global {
  /**
   * Credit
   */
  interface CreditInterface extends GeneralInterface {
    project_uuid: string;
    balance: number;
  }
  interface CreditResponse extends GeneralResponse<CreditInterface> {}

  interface CreditTransactionInterface extends GeneralInterface {
    amount: number;
    credit_id: number;
    direction: number;
    product_id: number;
    name: string;
    description: string;
    referenceId: string | null;
    referenceTable: string | null;
  }
  interface CreditTransactionsResponse extends GeneralItemsResponse<CreditTransactionInterface> {}

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
   * Invoice
   */
  interface InvoiceInterface extends GeneralInterface {
    project_uuid: string;
    subtotalAmount: number;
    referenceTable: string;
    referenceId: number;
    clientEmail: string;
    clientName: string;
    currency: string;
  }
  interface InvoiceResponse extends GeneralItemsResponse<InvoiceInterface> {}
}
