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
    httpsUrl: string | null;
    wssUrl: string | null;
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

  interface RpcApiKeyUsagePerChainInterface {
    [chainId: string]: {
      requests: number;
      responses: number;
      date: string;
    }[];
  }

  interface RpcFavoriteEndpointsResponse extends GeneralItemsResponse<RpcFavoriteEndpointInterface> {}
  interface RpcFavoriteEndpointResponse extends GeneralResponse<RpcFavoriteEndpointInterface> {}
  interface RpcEndpointsResponse extends GeneralResponse<RpcEndpointInterface[]> {}
  interface RpcApiKeyUsageResponse extends GeneralResponse<RpcApiKeyUsageInterface> {}
  interface RpcApiKeyUsagePerChainResponse extends GeneralResponse<RpcApiKeyUsagePerChainInterface> {}
}

export enum RpcPlanType {
  DISABLED = 1,
  FREE = 2,
  PAID = 3,
}
