export enum ApiKeyRole {
  EXECUTE = 50,
  WRITE = 51,
  READ = 52,
}

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
   * API key
   */
  interface ApiKeyInterface {
    id: number;
    status: string;
    apiKey: string;
    name: string;
    testNetwork: number;
    updateTime: string;
  }
  interface ApiKeysResponse {
    data: {
      items: Array<ApiKeyInterface>;
      total: number;
    };
    status: number;
  }

  interface ApiKeyCreatedInterface {
    id: string;
    status: string;
    apiKey: string;
    name: string;
    testNetwork: boolean;
    project_uuid: string;
    apiKeySecret: string;
  }
  interface ApiKeyCreatedResponse {
    data: ApiKeyCreatedInterface;
    status: number;
  }

  interface ApiKeyPermissions {
    read: boolean;
    write: boolean;
    execute: boolean;
  }
  interface FormGenerateApiKey {
    authentication: ApiKeyPermissions;
    storage: ApiKeyPermissions;
    computing: ApiKeyPermissions;
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
