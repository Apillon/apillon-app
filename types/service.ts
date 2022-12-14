/**
 * Service ENUM
 */
export enum ServiceType {
  AUTHENTICATION = 1,
  STORAGE = 2,
  COPMUTING = 3,
  BUCKET = 4,
}
export enum ServiceTypeName {
  AUTHENTICATION = 'authentication',
  STORAGE = 'storage',
  COPMUTING = 'computing',
  BUCKET = 'bucket',
  CRUST = 'crust',
  FOLDER = 'folder',
}

/**
 * Service type names (used in store)
 */
export const ServiceTypeNames: { [k: number]: ServiceTypeName } = {
  [ServiceType.AUTHENTICATION]: ServiceTypeName.AUTHENTICATION,
  [ServiceType.STORAGE]: ServiceTypeName.STORAGE,
  [ServiceType.COPMUTING]: ServiceTypeName.COPMUTING,
  [ServiceType.BUCKET]: ServiceTypeName.BUCKET,
};

/**
 * Bucket type
 */
export enum BucketType {
  STORAGE = 1,
  HOSTING = 2,
}

declare global {
  /**
   * Base responses
   */
  interface GeneralResponse {
    data: any;
    status: number;
  }
  interface DeleteResponse {
    data: boolean;
    status: number;
  }

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
  interface ServiceInterface {
    active: number;
    id: number;
    name: string;
    description: string;
    serviceType: string;
    serviceType_id: number;
    service_uuid: string;
    status: number;
    key?: number;
    uptime?: string;
  }

  interface ServicesResponse {
    data: {
      items: Array<ServiceInterface>;
      total: number;
    };
    status: number;
  }

  interface FormService {
    serviceName: string;
    networkType: boolean;
  }
  interface CreateServiceResponse {
    data: {
      id: number;
      status: number;
    };
    status: number;
  }

  /**
   * Bucket
   */
  interface BucketInterface {
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

  interface FormNewBucket {
    bucketName: string;
    bucketSize: string;
  }
  interface NewBucketResponse {
    data: BucketInterface;
    status: number;
  }
  interface BucketResponse {
    data: {
      items: Array<BucketInterface>;
      total: number;
    };
    status: number;
  }

  /**
   * Storage
   */
  interface FileUploadRequestInterface {
    fileUploadRequestId: number;
    file_uuid: string;
    signedUrlForUpload: string;
  }
  interface FileInterface {
    CID: string;
    bucket_id: number;
    contentType: string;
    directory_id: number;
    file_uuid: string;
    id: number;
    name: string;
    project_uuid: string;
    s3FileKey: string;
    size: number;
    status: number;
  }
  interface CrustInterface {
    amount: number;
    calculated_at: number;
    expired_at: number;
    file_size: number;
    prepaid: number;
    remaining_paid_count: number;
    replicas: Record<string, any>;
    reported_replica_count: number;
    spower: number;
  }
  interface FileDetailsInterface {
    file: FileInterface;
    fileStatus: number;
  }

  interface FormFileUploadRequest {
    fileName: string;
    contentType: string;
    directory_uuid?: string;
    path?: string;
  }
  interface FileUploadRequestResponse {
    data: FileUploadRequestInterface;
    status: number;
  }
  interface FileUploadSessionResponse {
    data: boolean;
    status: number;
  }

  interface FileDetailsResponse {
    data: FileDetailsInterface;
    status: number;
  }

  /** Folder */
  interface FolderInterface {
    CID: string | null;
    contentType: string | null;
    id: number;
    name: string;
    size: number | null;
    type: string;
    createTime: string;
    updateTime: string;
    file_uuid?: string;
    parentDirectoryId?: number;
  }
  interface FormFolder {
    name: string;
    description?: string | null;
  }
  interface CreateFolderResponse {
    data: {
      folder: FolderInterface;
      folderStatus: number;
    };
    status: number;
  }
  interface FolderResponse {
    data: {
      items: Array<FolderInterface>;
      total: number;
    };
    status: number;
  }
}
