export {};

declare global {
  /**
   * Billing
   */
  interface FormBilling {
    cardHolder: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    postalCode: string;
    terms: boolean;
  }

  interface BillingResponse {
    data: {
      items: any;
      total: number;
    };
    status: number;
  }

  /**
   * Generate API key
   */
  interface ApiKeyPermissions {
    read: boolean;
    write: boolean;
    xy?: boolean;
    zzz?: boolean;
  }
  interface FormGenerateApiKey {
    authentication: ApiKeyPermissions;
    storage: ApiKeyPermissions;
    computing: ApiKeyPermissions;
  }

  interface GenerateApiKeyResponse {
    data: any;
    status: number;
  }

  /**
   * Email configuration
   */
  interface FormEmailConfiguration {
    email: boolean;
    did: boolean;
  }

  interface EmailConfigurationResponse {
    data: any;
    status: number;
  }
}
