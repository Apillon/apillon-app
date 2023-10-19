/**
 * Service ENUM
 */
export enum ServiceType {
  AUTHENTICATION = 1,
  STORAGE = 2,
  NFT = 3,
  HOSTING = 4,
}
export enum ServiceTypeName {
  AUTHENTICATION = 'IDENTITY',
  STORAGE = 'STORAGE',
  NFT = 'NFT',
  HOSTING = 'HOSTING',
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
};

declare global {
  /**
   * Service Type
   */
  interface ServiceTypeInterface extends BaseObjectInterface {
    active: number;
  }
  interface ServiceTypeItem {
    id: number;
    name: string;
    icon: string;
    new?: boolean | null;
    disabled?: boolean | null;
  }

  /**
   * Service
   */
  interface FormService {
    serviceName: string;
    networkType: boolean;
  }
  interface ServiceTypeInterface extends BaseObjectInterface {
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
