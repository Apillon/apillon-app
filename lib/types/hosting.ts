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
  IN_REVIEW = 2,
  APPROVED = 3,
  SUCCESSFUL = 10,
  FAILED = 100,
  REJECTED = 101,
}

export enum WebsiteDomainStatus {
  /** Not yet processed and resolved */
  PENDING = 0,
  /** Domain is pointing to Apillon */
  OK = 1,
  /** Domain is pointing to Apillon, but uses CDN. Domain check should not be performed for such websites */
  HAS_CDN = 2,
  /** Domain is not pointing to Apillon IP */
  INVALID = 10,
}

declare global {
  /**
   * Webhook
   */
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
  interface WebsiteBaseInterface extends BaseObjectInterface {
    website_uuid: string;
    domain: string | null;
    domainChangeDate: string | null;
  }
  interface WebsiteInterface extends WebsiteBaseInterface {
    bucket_uuid: string;
    bucket: BucketInterface;
    cidProduction: string | null;
    cidStaging: string | null;
    ipnsProduction: string | null;
    ipnsStaging: string | null;
    productionBucket: BucketInterface;
    stagingBucket: BucketInterface;
    w3ProductionLink: string | null;
    w3StagingLink: string | null;
  }
  interface DeploymentInterface {
    cid: string | null;
    cidv1: string | null;
    deploymentStatus: number;
    deployment_uuid: string;
    environment: number;
    number: number | null;
    size: number;
    createTime: string;
    updateTime: string;
  }
  interface WebsiteResponse extends GeneralResponse<WebsiteInterface> {}
  interface WebsiteUpdateResponse extends GeneralResponse<WebsiteInterface> {}
  interface WebsitesBaseResponse extends GeneralItemsResponse<WebsiteBaseInterface> {}
  interface WebsitesResponse extends GeneralItemsResponse<WebsiteInterface> {}
  interface DeploymentResponse extends GeneralResponse<DeploymentInterface> {}
  interface DeploymentsResponse extends GeneralItemsResponse<DeploymentInterface> {}

  /**
   * Short URL
   */
  type ShortUrl = {
    targetUrl: string;
    url: string;
  };

  interface ShortUrlResponse extends GeneralResponse<ShortUrl> {}

  interface DomainInterface extends WebsiteInterface {
    domainStatus: number;
    domainLastCheckDate: string | null;
  }
  interface DomainResponse extends GeneralResponse<DomainInterface> {}
}
