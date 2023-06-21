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
  AUTHENTICATION = 'authentication',
  STORAGE = 'storage',
  NFT = 'nft',
  HOSTING = 'hosting',
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
  interface ServiceTypeInterface {
    id: number;
    name: string;
    description: string;
    active: number;
    status: number;
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
  interface ServiceTypeInterface {
    active: number;
    name: string;
    description: string;
    id: number;
    status: number;
  }
  interface ServiceTypeField extends ServiceTypeInterface {
    enabled: boolean;
  }
  interface ServiceInterface {
    active: number;
    name: string;
    description: string;
    serviceType: string;
    serviceType_id: number;
    service_uuid: string;
    status: number;
    key?: number;
    uptime?: string;
    updateTime?: string;
  }
  interface CreateServiceResponse extends GeneralResponse<{ id: number; status: number }> {}
  interface ServiceResponse extends GeneralResponse<ServiceInterface> {}
  interface ServicesResponse extends GeneralItemsResponse<ServiceInterface> {}
  interface ServiceTypesResponse extends GeneralResponse<ServiceTypeInterface[]> {}
}
