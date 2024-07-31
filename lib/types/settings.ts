export enum ApiKeyRole {
  EXECUTE = 50,
  WRITE = 51,
  READ = 52,
}

export enum Permission {
  STORAGE = 1,
  HOSTING = 2,
  NFTS = 3,
  AUTHENTICATION = 4,
  COMPUTING = 5,
  SOCIAL = 6,
  EMBEDDED_WALLET = 7,
}

/* OAuth link type */
export enum OauthLinkType {
  DISCORD = 1,
  TWEETER = 2,
  GITHUB = 3,
}

declare global {
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

  interface EwApiKeyInterface {
    id: number;
    status: string;
    apiKey: string;
    name: string;
    testNetwork: number;
    updateTime: string;
    oasisSignatures: number;
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
  interface EwApiKeysResponse extends GeneralItemsResponse<EwApiKeyInterface> {}

  /**
   * Oauth Link
   */
  interface OauthLinkInterface {
    createTime: string;
    email: string;
    externalUserId: string;
    externalUsername: string;
    type: number;
    user_uuid: string;
  }
  interface OauthLinkResponse extends GeneralResponse<OauthLinkInterface> {}
  interface OauthLinksResponse {
    data: {
      data: Array<OauthLinkInterface>;
      status: number;
      success: boolean;
    };
    id: string;
    status: number;
  }

  /**
   * Discord
   */
  interface DiscordLinkInterface {
    url: string;
  }
  interface DiscordLinkResponse extends GeneralResponse<DiscordLinkInterface> {}
}
