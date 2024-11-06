declare global {
  interface RpcApiKeyInterface extends BaseObjectInterface {
    id: number;
    uuid: string;
    project_uuid: string;
  }

  interface RpcApiKeyResponse extends GeneralResponse<RpcApiKeyInterface> {}
  interface RpcApiKeysResponse extends GeneralItemsResponse<RpcApiKeyInterface> {}

  interface RpcFavoriteEndpointInterface extends BaseObjectInterface {
    id: number;
    chainName: string;
    network: string;
    httpsUrl: string;
    wssUrl: string;
  }

  interface RpcEndpointInterface extends BaseObjectInterface {
    id: number;
    name: string;
    image_url: string;
    type: string;
    networkName: string;
    networkId: number;
    chainName: string;
    nodes: {
      https: string;
      wss: string;
    }[];
    favoriteData?: RpcFavoriteEndpointInterface;
    isFavorite: boolean;
  }

  interface RpcApiKeyUsageInterface extends BaseObjectInterface {
    per_day: Record<string, { requests: number; responses: number }>;
    requests: number;
    responses: number;
    // Represent the total requests and responses for the current day regardless of the api key
    totalRequests: number;
    totalResponses: number;
  }

  interface RpcFavoriteEndpointsResponse
    extends GeneralItemsResponse<RpcFavoriteEndpointInterface> {}

  interface RpcFavoriteEndpointResponse extends GeneralResponse<RpcFavoriteEndpointInterface> {}

  interface RpcEndpointsResponse extends GeneralResponse<RpcEndpointInterface[]> {}

  interface RpcApiKeysQuotaResponse extends GeneralResponse<boolean> {}

  interface RpcApiKeyUsageResponse extends GeneralResponse<RpcApiKeyUsageInterface> {}
}

export enum RpcPlanType {
  DISABLED = 1,
  FREE = 2,
  PAID = 3,
}