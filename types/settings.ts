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
  interface BillingResponse extends GeneralItemsResponse<any> {}

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

  interface ApiKeyCreatedInterface {
    id: string;
    status: string;
    apiKey: string;
    name: string;
    testNetwork: boolean;
    project_uuid: string;
    apiKeySecret: string;
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

  interface ApiKeyCreatedResponse extends GeneralResponse<ApiKeyCreatedInterface> {}
  interface ApiKeyRolesResponse extends GeneralResponse<Array<ApiKeyRoleInterface>> {}
  interface ApiKeyRoleUpdateResponse extends GeneralResponse<ApiKeyRoleInterface> {}
  interface ApiKeysResponse extends GeneralItemsResponse<ApiKeyInterface> {}

  /**
   * Email configuration
   */
  interface FormEmailConfiguration {
    email: boolean;
    did: boolean;
  }
  interface EmailConfigurationResponse extends GeneralResponse<any> {}
}