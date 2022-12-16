/**
 * Bucket type
 */
export enum BucketType {
  STORAGE = 1,
  HOSTING = 2,
}

/** Webhook Auth method */
export enum BucketWebhookAuthMethod {
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
   * File
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
  interface FileUploadsResponse {
    data: {
      items: Array<FileUploadInterface>;
      total: number;
    };
    status: number;
  }

  /**
   * Folder
   */
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
  interface WebhookResponse {
    data: WebhookInterface;
    status: number;
  }
}
