import { crustTypes } from '@crustio/type-definitions';

/**
 * Bucket type
 */
export enum BucketType {
  STORAGE = 1,
  HOSTING = 2,
}

/**
 * Bucket item
 */
export enum BucketItemType {
  FILE = 'file',
  DIRECTORY = 'directory',
}

/**
 * File status
 */
export enum FileStatus {
  REQUEST_FOR_UPLOAD_GENERATED = 1,
  UPLOADED_TO_S3 = 2,
  UPLOADED_TO_IPFS = 3,
  PINNED_TO_CRUST = 4,
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
}

export enum FileUploadStatusValue {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  FINISHED = 'finished',
  REMOVED = 'removed',
  ERROR = 'error',
}

/** Webhook Auth method */
export enum BucketWebhookAuthMethod {
  NONE = 'none',
  BASIC = 'basic',
  TOKEN = 'bearer-token',
}

declare global {
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
    uploadedSize: number | null;
    CID: string | null;
    IPNS: string | null;
    sizeMb?: number;
    maxSizeMb?: number;
    percentage?: number;
  }

  interface FormNewBucket {
    bucketName: string;
    bucketDescription: string;
    bucketSize: number;
  }
  interface BucketResponse extends GeneralResponse<BucketInterface> {}
  interface BucketsResponse extends GeneralItemsResponse<BucketInterface> {}
  interface BucketQuotaResponse extends GeneralResponse<boolean> {}

  /**
   * Bucket item
   */
  interface BucketItemInterface {
    CID: string | null;
    contentType: string | null;
    id: number;
    name: string;
    link: string;
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
  interface CreateFolderResponse extends GeneralResponse<BucketItemInterface> {}
  interface FolderResponse extends GeneralItemsResponse<BucketItemInterface> {}

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
    signedUrlForUpload: string;
  }
  interface FileInterface {
    CID: string;
    bucket_id: number;
    contentType: string;
    directory_id: number;
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
    bucket_id: number;
    url: string;
    authMethod: string;
    param1: string;
    param2?: string;
  }
  interface WebhookResponse extends GeneralResponse<WebhookInterface> {}

  /**
   * Webpage
   */
  interface FormWebpage {
    name: string;
    description: string;
    domain?: string | null;
  }
  interface WebpageBaseInterface {
    id: number;
    status: number;
    project_uuid: string;
    bucket_id: number;
    stagingBucket_id: number;
    productionBucket_id: number;
    name: string;
    description: string;
    domain: string;
  }
  interface WebpageInterface {
    id: number;
    status: number;
    project_uuid: string;
    bucket: BucketInterface;
    bucket_id: number;
    stagingBucket: BucketInterface;
    stagingBucket_id: number;
    productionBucket: BucketInterface;
    productionBucket_id: number;
    name: string;
    description: string;
    domain: string;
  }
  interface WebpageResponse extends GeneralResponse<WebpageInterface> {}
  interface WebpageUpdateResponse extends GeneralResponse<WebpageInterface> {}
  interface WebpagesResponse extends GeneralItemsResponse<WebpageInterface> {}
}
