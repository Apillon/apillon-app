/**
 * Billing
 */
export interface FormBilling {
  cardHolder: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  postalCode: string;
  terms: boolean;
}

export interface BillingResponse {
  data: {
    items: any;
    total: number;
  };
  status: number;
}
