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

export enum DeploymentBuildStatus {
  PENDING = 1,
  IN_PROGRESS = 2,
  SUCCESS = 3,
  FAILED = 4,
}

export enum WebsiteSource {
  APILLON = 1,
  GITHUB = 2,
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
    bucket_uuid: string;
    cidProduction: string | null;
    cidStaging: string | null;
    domain: string | null;
    domainChangeDate: string | null;
    domainStatus: number;
    ipnsProduction: string | null;
    nftCollectionUuid: string | null;
    source: WebsiteSource;
    website_uuid: string;
  }
  interface WebsiteInterface extends WebsiteBaseInterface {
    bucket: BucketInterface;
    domainChangeDate: string | null;
    domainLastCheckDate: string | null;
    ipnsStaging: string | null;
    lastDeployment_uuid: string | null;
    lastDeploymentStatus: number | null;
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

  interface DeploymentBuildInterface {
    buildStatus: number;
    createTime: string;
    deploymentConfigId: number;
    finishedTime: string;
    id: number;
    logs: string;
    status: number;
    websiteUuid: string;
  }

  interface DeploymentConfigVariable {
    key: string;
    value: string;
  }
  interface DeploymentConfigVariablesResponse extends GeneralResponse<DeploymentConfigVariable[]> {}

  interface DeploymentConfigInterface {
    id: number;
    repoId: number;
    repoName: string;
    repoOwnerName: string;
    hookId: number;
    branchName: string;
    websiteUuid: string;
    projectConfigId: number;
    buildCommand: string | null;
    buildDirectory: string;
    installCommand: string | null;
    apiKey: string;
    apiSecret: string;
    encryptedVariables: string | null;
  }
  interface DeploymentConfigResponse extends GeneralResponse<DeploymentConfigInterface> {}

  interface DeploymentBuildResponse extends GeneralResponse<DeploymentBuildInterface> {}
  interface DeploymentBuildsResponse extends GeneralItemsResponse<DeploymentBuildInterface> {}
  /**
   * Short URL
   */
  type ShortUrl = {
    targetUrl: string;
    url: string;
  };

  interface ShortUrlResponse extends GeneralResponse<ShortUrl> {}
}
