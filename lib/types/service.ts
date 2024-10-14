/**
 * Service ENUM
 */
export enum ServiceType {
  AUTHENTICATION = 1,
  STORAGE = 2,
  NFT = 3,
  HOSTING = 4,
  COMPUTING = 5,
  SOCIAL = 6,
}
export enum ServiceTypeName {
  STORAGE = 'STORAGE',
  HOSTING = 'HOSTING',
  AUTHENTICATION = 'IDENTITY',
  NFT = 'NFT',
  COMPUTING = 'COMPUTING',
  SOCIAL = 'SOCIAL',
  CONTRACTS = 'CONTRACTS',
}

export enum IdentityChains {
  KILT = 'KILT',
}

/**
 * Names of Product price names of all services
 */
export enum PriceServiceName {
  HOSTING_WEBSITE = 'HOSTING_WEBSITE',
  HOSTING_DEPLOY_TO_STAGING = 'HOSTING_DEPLOY_TO_STAGING',
  HOSTING_DEPLOY_TO_PRODUCTION = 'HOSTING_DEPLOY_TO_PRODUCTION',
  HOSTING_CHANGE_WEBSITE_DOMAIN = 'HOSTING_CHANGE_WEBSITE_DOMAIN',
  NFT_MOONBEAM_COLLECTION = 'NFT_MOONBEAM_COLLECTION',
  NFT_MOONBASE_COLLECTION = 'NFT_MOONBASE_COLLECTION',
  NFT_ASTAR_COLLECTION = 'NFT_ASTAR_COLLECTION',
  NFT_MOONBEAM_MINT = 'NFT_MOONBEAM_MINT',
  NFT_MOONBASE_MINT = 'NFT_MOONBASE_MINT',
  NFT_ASTAR_MINT = 'NFT_ASTAR_MINT',
  NFT_MOONBEAM_BURN = 'NFT_MOONBEAM_BURN',
  NFT_MOONBASE_BURN = 'NFT_MOONBASE_BURN',
  NFT_ASTAR_BURN = 'NFT_ASTAR_BURN',
  NFT_MOONBEAM_TRANSFER_COLLECTION = 'NFT_MOONBEAM_TRANSFER_COLLECTION',
  NFT_MOONBASE_TRANSFER_COLLECTION = 'NFT_MOONBASE_TRANSFER_COLLECTION',
  NFT_ASTAR_TRANSFER_COLLECTION = 'NFT_ASTAR_TRANSFER_COLLECTION',
  NFT_MOONBEAM_SET_BASE_URI = 'NFT_MOONBEAM_SET_BASE_URI',
  NFT_MOONBASE_SET_BASE_URI = 'NFT_MOONBASE_SET_BASE_URI',
  NFT_ASTAR_SET_BASE_URI = 'NFT_ASTAR_SET_BASE_URI',
  KILT_IDENTITY = 'KILT_IDENTITY',
  SOCIAL_SPACE = 'SOCIAL_SPACE',
  SOCIAL_POST = 'SOCIAL_POST',
  COMPUTING_SCHRODINGER_CREATE = 'COMPUTING_SCHRODINGER_CREATE',
  COMPUTING_SCHRODINGER_ASSIGN_CID_TO_NFT = 'COMPUTING_SCHRODINGER_ASSIGN_CID_TO_NFT',
  COMPUTING_SCHRODINGER_TRANSFER_OWNERSHIP = 'COMPUTING_SCHRODINGER_TRANSFER_OWNERSHIP',
}
export enum PriceServiceCategory {
  WEBSITE = 'WEBSITE',
  MOONBEAM_NFT = 'MOONBEAM_NFT',
  MOONBASE_NFT = 'MOONBASE_NFT',
  ASTAR_NFT = 'ASTAR_NFT',
  KILT_IDENTITY = 'KILT_IDENTITY',
  GRILL_CHAT = 'GRILLCHAT',
}
export enum PriceServiceAction {
  BURN = 'BURN',
  COLLECTION = 'COLLECTION',
  MINT = 'MINT',
  SET_BASE_URI = 'SET_BASE_URI',
  TRANSFER_COLLECTION = 'TRANSFER_COLLECTION',
}

/**
 * Service type names (used in store)
 */
export const ServiceTypeNames: { [k: number]: ServiceTypeName } = {
  [ServiceType.AUTHENTICATION]: ServiceTypeName.AUTHENTICATION,
  [ServiceType.STORAGE]: ServiceTypeName.STORAGE,
  [ServiceType.NFT]: ServiceTypeName.NFT,
  [ServiceType.HOSTING]: ServiceTypeName.HOSTING,
  [ServiceType.COMPUTING]: ServiceTypeName.COMPUTING,
  [ServiceType.SOCIAL]: ServiceTypeName.SOCIAL,
};

declare global {
  /**
   * Service Type
   */
  interface ServiceTypeInterface extends BaseObjectInterface {
    active: number;
  }

  /**
   * Service
   */
  interface ServiceTypeInterface extends BaseObjectInterface {
    id: number;
    active: number;
  }
  interface ServiceTypeField extends ServiceTypeInterface {
    enabled: boolean;
  }
  interface ServiceInterface extends BaseObjectInterface {
    active: number;
    serviceType: string;
    serviceType_id: number;
    service_uuid: string;
    key?: number;
    uptime?: string;
  }
  interface CreateServiceResponse extends GeneralResponse<{ id: number; status: number }> {}
  interface ServiceResponse extends GeneralResponse<ServiceInterface> {}
  interface ServicesResponse extends GeneralItemsResponse<ServiceInterface> {}
  interface ServiceTypesResponse extends GeneralResponse<ServiceTypeInterface[]> {}
}
