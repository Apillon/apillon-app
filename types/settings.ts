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
   * API key - Form
   */
  interface ApiKeyPermissionForm {
    key: number;
    label: string;
    name: string;
    value: boolean;
  }
  interface ApiKeyRoleForm {
    enabled: boolean;
    name: string;
    serviceType: string;
    service_uuid: string;
    permissions: Array<ApiKeyPermissionForm>;
  }
  interface ApiKeyForm {
    name: string;
    apiKeyType: boolean;
    roles: Array<ApiKeyRoleForm>;
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

  interface ApiKeyRoleInterface {
    id?: number;
    apiKey_id: number;
    role_id: number;
    serviceType_id: number;
    project_uuid: string;
    service_uuid: string;
    status?: number;
  }
  interface ApiKeyRolesResponse {
    data: Array<ApiKeyRoleInterface>;
    status: number;
  }
  interface ApiKeyRoleUpdateResponse {
    data: ApiKeyRoleInterface;
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
