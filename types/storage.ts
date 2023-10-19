import { crustTypes } from '@crustio/type-definitions';

/**
 * Bucket type
 */
export enum BucketType {
  STORAGE = 1,
  HOSTING = 2,
  NFT_METADATA = 3,
}

/**
 * Bucket item
 */
export enum BucketItemType {
  DIRECTORY = 1,
  FILE = 2,
}

/**
 * File status
 */
export enum FileStatus {
  REQUEST_FOR_UPLOAD_GENERATED = 1,
  UPLOADED_TO_S3 = 2,
  UPLOADED_TO_IPFS = 3,
  PINNED_TO_CRUST = 4,
  UPLOAD_COMPLETED = 5,
}
export enum FileUploadRequestFileStatus {
  SIGNED_URL_FOR_UPLOAD_GENERATED = 1,
  UPLOADED_TO_S3 = 2,
  UPLOADED_TO_IPFS = 3,
  PINNED_TO_CRUST = 4,
  UPLOAD_COMPLETED = 5,
  ERROR_UPLOADING_TO_IPFS = 100,
  ERROR_PINING_TO_CRUST = 101,
  ERROR_FILE_NOT_EXISTS_ON_S3 = 102,
  ERROR_BUCKET_FULL = 103,
  ERROR_FILE_UPLOAD_REQUEST_DOES_NOT_EXISTS = 104,
  ERROR_CREATING_FILE_OBJECT = 105,
  ERROR_NOT_ENOUGH_STORAGE = 106,
  ERROR_MAX_STORAGE_REACHED = 107,
}

export enum FileUploadStatusValue {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  FINISHED = 'finished',
  REMOVED = 'removed',
  ERROR = 'error',
}
export enum TableFilesType {
  BUCKET = 1,
  HOSTING = 2,
  NFT_METADATA = 3,
  DEPLOYMENT = 4,
}

/** Webhook Auth method */
export enum BucketWebhookAuthMethod {
  NONE = 'none',
  BASIC = 'basic',
  TOKEN = 'bearer-token',
}

/** Hosting deploy env */
export enum DeploymentEnvironment {
  STAGING = 1,
  PRODUCTION = 2,
  DIRECT_TO_PRODUCTION = 3,
}

/** Hosting deployment status */
export enum DeploymentStatus {
  INITIATED = 0,
  IN_PROGRESS = 1,
  SUCCESSFUL = 10,
  FAILED = 100,
}

declare global {
  /**
   * Storage
   */
  interface StorageInfoInterface {
    availableStorage: number;
    usedStorage: number;
  }
  interface StorageInfoResponse extends GeneralResponse<StorageInfoInterface> {}

  /**
   * Bucket
   */
  interface BucketInterface extends BaseObjectInterface {
    bucketType: number;
    bucket_uuid: string;
    project_uuid: string;
    size: number | null;
  }

  interface FormNewBucket {
    bucketName: string;
    bucketDescription: string | null;
  }
  interface BucketResponse extends GeneralResponse<BucketInterface> {}
  interface BucketsResponse extends GeneralItemsResponse<BucketInterface> {}
  interface BucketQuotaResponse extends GeneralResponse<boolean> {}

  /**
   * Bucket item
   */
  interface BucketItemInterface extends BaseObjectInterface {
    CID: string | null;
    contentType: string | null;
    directoryUuid: string | null;
    fileStatus: number | null;
    link: string;
    size: number | null;
    type: number;
    uuid: string;
    file_uuid?: string;
  }
  interface FormFolder {
    name: string;
    description?: string | null;
  }
  interface CreateFolderResponse extends GeneralResponse<BucketItemInterface> {}
  interface BucketItemResponse extends GeneralResponse<BucketItemInterface> {}
  interface FolderResponse extends GeneralItemsResponse<BucketItemInterface> {}

  type FetchDirectoryParams = {
    bucketUuid?: string;
    folderUuid?: string;
    page?: number;
    limit?: number;
    search?: string;
    orderBy?: string;
    order?: string;
    markedForDeletion?: boolean;
    loader?: boolean;
  };

  /**
   * IPNS
   */
  interface IpnsInterface extends BaseObjectInterface {
    id: number;
    ipnsName: string | null;
    ipnsValue: string | null;
    link: string | null;
    updateTime: string;
  }
  interface FormIpns {
    name: string;
    description?: string | null;
  }
  interface FormIpnsPublish {
    ipns?: number;
  }
  interface IpnsCreateResponse extends GeneralResponse<IpnsInterface> {}
  interface IpnsUpdateResponse extends GeneralResponse<IpnsInterface> {}
  interface IpnsPublishResponse extends GeneralResponse<IpnsInterface> {}
  interface IpnsItemResponse extends GeneralResponse<IpnsInterface> {}
  interface IpnsResponse extends GeneralItemsResponse<IpnsInterface> {}

  /**
   * File
   */
  /** File status */
  type FileUploadStatus =
    | FileUploadStatusValue.PENDING
    | FileUploadStatusValue.UPLOADING
    | FileUploadStatusValue.FINISHED
    | FileUploadStatusValue.REMOVED
    | FileUploadStatusValue.ERROR;
  interface FileUploadRequestInterface {
    fileUploadRequestId: number;
    file_uuid: string;
    url: string;
  }
  interface S3FileUploadRequestInterface {
    contentType: string;
    fileName: string;
    file_uuid: string;
    path: string;
    url: string;
  }
  interface S3FilesUploadRequestInterface {
    files: Array<S3FileUploadRequestInterface>;
    session_uuid: string;
  }

  interface FileInterface {
    CID: string;
    bucket_uuid: string;
    contentType: string;
    directory_uuid: string;
    link: string;
    file_uuid: string;
    id: number;
    name: string;
    project_uuid: string;
    s3FileKey: string;
    size: number;
    status: number;
    fileName?: string | null;
    fileStatus?: number | null;
    path?: string | null;
  }
  interface FileUploadInterface {
    id: number;
    status: number;
    file_uuid: string;
    path: string;
    fileName: string;
    contentType: string;
    fileStatus: number;
    CID: string;
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
    session_uuid?: string;
    path?: string;
  }

  type FileDetails = FileInterface | FileUploadInterface;
  type FileCrust = typeof crustTypes.market.types.FileInfoV2;

  interface FileDetailsResponse extends GeneralResponse<FileDetailsInterface> {}
  interface FileUploadRequestResponse extends GeneralResponse<FileUploadRequestInterface> {}
  interface FilesUploadRequestResponse extends GeneralResponse<S3FilesUploadRequestInterface> {}
  interface FileUploadSessionResponse extends GeneralResponse<boolean> {}
  interface FileUploadsResponse extends GeneralItemsResponse<FileUploadInterface> {}

  /**
   * Webhook
   */
  interface FormWebhook {
    url: string;
    authType: string;
    param1: string;
    param2?: string;
  }
  interface WebhookInterface {
    id: number;
    status: number;
    bucket_uuid: string;
    url: string;
    authMethod: string;
    param1: string;
    param2?: string;
  }
  interface WebhookResponse extends GeneralResponse<WebhookInterface> {}

  /**
   * Website
   */
  interface FormWebsite {
    name: string;
    description: string;
  }
  interface FormWebsiteDomain {
    domain?: string | null;
  }
  interface WebsiteBaseInterface extends BaseObjectInterface {
    website_uuid: string;
    domain: string | null;
    domainChangeDate: string | null;
  }
  interface WebsiteInterface extends WebsiteBaseInterface {
    bucket_uuid: string;
    bucket: BucketInterface;
    ipnsProduction: string | null;
    ipnsProductionLink: string | null;
    ipnsStaging: string | null;
    ipnsStagingLink: string | null;
    productionBucket: BucketInterface;
    stagingBucket: BucketInterface;
    w3ProductionLink: string | null;
    w3StagingLink: string | null;
  }
  interface DeploymentInterface {
    id: number;
    status: number;
    website_uuid: string;
    bucket_uuid: string;
    environment: number;
    deploymentStatus: number;
    cid: string | null;
    size: number;
    number: number | null;
    updateTime?: string;
  }
  interface WebsiteResponse extends GeneralResponse<WebsiteInterface> {}
  interface WebsiteUpdateResponse extends GeneralResponse<WebsiteInterface> {}
  interface WebsitesBaseResponse extends GeneralItemsResponse<WebsiteBaseInterface> {}
  interface WebsitesResponse extends GeneralItemsResponse<WebsiteInterface> {}
  interface WebsiteQuotaResponse extends GeneralResponse<boolean> {}
  interface DeploymentResponse extends GeneralResponse<DeploymentInterface> {}
  interface DeploymentsResponse extends GeneralItemsResponse<DeploymentInterface> {}
}
