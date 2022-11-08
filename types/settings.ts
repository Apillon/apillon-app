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

/**
 * Generate API key
 */
export interface ApiKeyPermissions {
  read: boolean;
  write: boolean;
  xy?: boolean;
  zzz?: boolean;
}
export interface FormGenerateApiKey {
  authentication: ApiKeyPermissions;
  storage: ApiKeyPermissions;
  computing: ApiKeyPermissions;
}

export interface GenerateApiKeyResponse {
  data: any;
  status: number;
}

/**
 * Email configuration
 */
export interface FormEmailConfiguration {
  email: boolean;
  did: boolean;
}

export interface EmailConfigurationResponse {
  data: any;
  status: number;
}
