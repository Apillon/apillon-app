/**
 * Service ENUM
 */
export enum ServiceType {
  AUTHENTICATION = 1,
  STORAGE = 2,
  COPMUTING = 3,
}

/**
 * Service Type
 */
export interface ServiceTypeInterface {
  id: number;
  name: string;
  description: string;
  active: number;
  status: number;
}
export interface ServiceTypeItem {
  id: number;
  name: string;
  icon: string;
  new?: boolean | null;
  disabled?: boolean | null;
}

/**
 * Service
 */
export interface ServicesInterface {
  name: string;
  serviceType: string;
  active: number;
  uptime: string;
}

export interface ServicesResponse {
  data: {
    items: ServicesInterface[];
    total: number;
  };
  status: number;
}

export interface FormService {
  serviceName: string;
  networkType: boolean;
}
export interface CreateServiceResponse {
  data: {
    id: number;
    status: number;
  };
  status: number;
}

/**
 * Bucket
 */
export enum BucketType {
  STORAGE = 1,
  HOSTING = 2,
}
export interface BucketInterface {
  id: number;
  status: number;
  bucket_uuid: string;
  project_uuid: string;
  bucketType: number;
  name: string;
  description: string;
  maxSize: number;
  size: number | null;
  CID: string | null;
  IPNS: string | null;
  sizeMb?: number;
  maxSizeMb?: number;
  percentage?: number;
}

export interface FormNewBucket {
  bucketName: string;
  bucketSize: string;
}
export interface NewBucketResponse {
  data: BucketInterface;
  status: number;
}
export interface BucketResponse {
  data: {
    items: BucketInterface;
    total: number;
  };
  status: number;
}
