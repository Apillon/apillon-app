const Endpoints = {
  /**
   * AUTH
   */
  /** Auth */
  walletMsg: '/users/auth-msg',
  walletLogin: '/users/login/wallet',
  walletConnect: '/users/wallet-connect',

  /** User */
  me: '/users/me',
  login: '/users/login',
  loginWithKilt: '/users/login-kilt',
  register: '/users/register',
  validateMail: '/users/validate-email',
  passwordReset: '/users/password-reset',
  passwordResetRequest: '/users/password-reset-request',
  oauthSession: '/users/oauth-session',

  /**
   * Dashboard
   */

  /** Project */
  projects: '/projects',
  projectsQuota: '/projects/qouta-reached',
  projectsUserProjects: '/projects/user-projects',
  project: (projectUuid: string) => {
    return `/projects/${projectUuid}`;
  },
  projectOverview: (projectUuid: string) => {
    return `/projects/${projectUuid}/overview`;
  },
  projectUsers: (projectUuid: string) => {
    return `/projects/${projectUuid}/users`;
  },
  projectInviteUser: (projectUuid: string) => {
    return `/projects/${projectUuid}/invite-user`;
  },
  projectUser: (id: number) => {
    return `/projects/user/${id}`;
  },
  projectUserUninvite: (projectUuid: string) => {
    return `/projects/${projectUuid}/uninvite-user`;
  },

  /** Payments */
  credit: (projectUuid: string) => {
    return `/projects/${projectUuid}/credit`;
  },
  creditSettings: (projectUuid: string) => {
    return `/projects/${projectUuid}/credit-settings`;
  },
  creditTransactions: (projectUuid: string) => {
    return `/projects/${projectUuid}/credit/transactions`;
  },
  activeSubscription: (projectUuid: string) => {
    return `/projects/${projectUuid}/active-subscription`;
  },
  subscriptions: (projectUuid: string) => {
    return `/projects/${projectUuid}/subscriptions`;
  },
  invoices: (projectUuid: string) => {
    return `/projects/${projectUuid}/invoices`;
  },
  productPrice: (productId?: string | number) => {
    return productId ? `/payments/products/${productId}/price` : '/payments/products/price-list';
  },
  crypto: (id?: string | number) => {
    return id ? `/payments/crypto/payment/${id}` : '/payments/crypto/payment';
  },
  creditSessionUrl: '/payments/stripe/credit-session-url',
  subscriptionSessionUrl: '/payments/stripe/subscription-session-url',
  customerPortalUrl: '/payments/stripe/customer-portal-session-url',
  creditPackages: '/payments/credit/packages',
  subscriptionPackages: '/payments/subscription/packages',

  /** Services */
  serviceTypes: '/services/types',
  services: (id?: number | string) => {
    return id ? `/services/${id}` : '/services';
  },

  /** Instructions */
  instructions: (key?: string) => {
    return key ? `/instructions/${key}` : '/instructions';
  },

  /** Bucket */
  buckets: '/buckets/',
  bucket: (bucketUuid: string) => {
    return `/buckets/${bucketUuid}`;
  },
  bucketContent: (bucketUuid: string) => {
    return `/buckets/${bucketUuid}/content`;
  },
  bucketRestore: (bucketUuid: string) => {
    return `/buckets/${bucketUuid}/cancel-deletion`;
  },
  bucketWebhook: (bucketUuid: string, webhookId?: number) => {
    return webhookId
      ? `/buckets/${bucketUuid}/webhook/${webhookId}`
      : `/buckets/${bucketUuid}/webhook`;
  },

  /** Directories */
  directory: (id?: string) => {
    return id ? `/directories/${id}` : '/directories';
  },
  directoryContent: '/directories/directory-content',

  /** File */
  file: (key?: string) => {
    return key ? `/files/${key}` : '/files';
  },

  /** Storage */
  storage: '/storage/',
  storageInfo: '/storage/info',
  storageFileUpload: (bucketUuid: string, sessionUuid?: string) => {
    return sessionUuid
      ? `/storage/${bucketUuid}/file-upload/${sessionUuid}/end`
      : `/storage/${bucketUuid}/file-upload`;
  },
  storageFilesUpload: (bucketUuid: string) => {
    return `/storage/${bucketUuid}/files-upload`;
  },
  storageFileUploads: (bucketUuid: string) => {
    return `/storage/${bucketUuid}/file-uploads`;
  },
  storageFileUploadSessions: (bucketUuid: string) => {
    return `/storage/${bucketUuid}/file-upload-sessions`;
  },
  storageFileDetails: (bucketUuid: string, fileUuid: string) => {
    return `/storage/${bucketUuid}/file/${fileUuid}/detail`;
  },
  storageSyncToIpfs: (bucketUuid: string, fileUuid: string) => {
    return `/storage/${bucketUuid}/file/${fileUuid}/sync-to-ipfs`;
  },
  storageFileDelete: (bucketUuid: string, fileUuid: string | number) => {
    return `/storage/${bucketUuid}/file/${fileUuid}`;
  },
  storageFileRestore: (bucketUuid: string, fileUuid: string | number) => {
    return `/storage/${bucketUuid}/file/${fileUuid}/restore`;
  },
  storageFilesTrashed: (bucketUuid: string) => {
    return `/storage/${bucketUuid}/trashed-files`;
  },

  /** IPNS */
  ipns: (bucketUuid: string, uuid?: string) => {
    return uuid ? `/buckets/${bucketUuid}/ipns/${uuid}` : `/buckets/${bucketUuid}/ipns`;
  },
  ipnsPublish: (bucketUuid: string, uuid: string) => {
    return `/buckets/${bucketUuid}/ipns/${uuid}/publish`;
  },

  /** IPFS */
  ipfsInfo: '/storage/ipfs-cluster-info',
  ipfsLink: '/storage/link-on-ipfs/',

  /**
   * Hosting
   */
  shortUrl: '/storage/hosting/short-url',

  /** Website */
  website: '/storage/hosting/website',
  websites: (uuid?: string) => {
    return uuid ? `/storage/hosting/websites/${uuid}` : '/storage/hosting/websites';
  },
  websiteDeploy: (uuid?: string) => {
    return `/storage/hosting/websites/${uuid}/deploy`;
  },
  websiteActivate: (uuid?: string) => {
    return `/storage/hosting/websites/${uuid}/activate`;
  },
  websiteDomainStatus: (uuid?: string) => {
    return `/storage/hosting/websites/${uuid}/check-domain`;
  },

  /** Deployment */
  deployment: (websiteUuid: string, deploymentUuid: string) => {
    return `/storage/hosting/websites/${websiteUuid}/deployments/${deploymentUuid}`;
  },
  deployments: (websiteUuid: string) => {
    return `/storage/hosting/websites/${websiteUuid}/deployments`;
  },

  /**
   * NFT
   */
  nftCheckTransactionsStatus: '/nfts/check-transactions-status',
  nftDeploy: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/deploy`;
  },

  /** Collection */
  collectionsSubstrate: '/nfts/collections/substrate',
  collections: (id?: string) => {
    return id ? `/nfts/collections/${id}` : '/nfts/collections';
  },
  collectionTransactions: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/transactions`;
  },
  collectionSetBaseUri: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/set-base-uri`;
  },
  collectionTransferOwnership: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/transferOwnership`;
  },
  collectionBurn: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/burn`;
  },
  collectionMint: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/mint`;
  },
  collectionNestMint: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/nest-mint`;
  },
  collectionNftsMetadata: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/nfts-metadata`;
  },
  collectionIpns: (id: string) => {
    return `/nfts/collections/${id}/ipns`;
  },
  collectionActivate: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/activate`;
  },

  /**
   * Computing
   */
  /** Contracts */
  contracts: (uuid?: string) => {
    return uuid ? `/computing/contracts/${uuid}` : '/computing/contracts';
  },
  contractAssignCid: (uuid?: string) => {
    return `/computing/contracts/${uuid}/assign-cid-to-nft`;
  },
  contractEncrypt: (uuid?: string) => {
    return `/computing/contracts/${uuid}/encrypt`;
  },
  contractTransferOwnership: (uuid: string) => {
    return `/computing/contracts/${uuid}/transfer-ownership`;
  },
  contractTransactions: (contractUuid: string) => {
    return `/computing/contracts/${contractUuid}/transactions`;
  },
  contractActivate: (contractUuid: string) => {
    return `/computing/contracts/${contractUuid}/activate`;
  },

  /** Cloud functions - Acurast */
  cloudFunctions: (uuid?: string) => {
    return uuid ? `/acurast/cloud-functions/${uuid}` : '/acurast/cloud-functions';
  },
  cloudFunctionActivate: (uuid: string) => {
    return `/acurast/cloud-functions/${uuid}/activate`;
  },
  cloudFunctionEnvironment: (uuid: string) => {
    return `/acurast/cloud-functions/${uuid}/environment`;
  },
  cloudFunctionExecute: (uuid: string) => {
    return `/acurast/cloud-functions/${uuid}/execute`;
  },
  cloudFunctionJobs: (uuid: string) => {
    return `/acurast/cloud-functions/${uuid}/jobs`;
  },
  cloudFunctionUsage: (uuid: string) => {
    return `/acurast/cloud-functions/${uuid}/usage`;
  },
  acurastJobs: (uuid: string) => {
    return `/acurast/jobs/${uuid}`;
  },

  /** Embedded wallet */
  embeddedWallets: (uuid?: number | string) => {
    return uuid ? `/embedded-wallet/integrations/${uuid}` : '/embedded-wallet/integrations';
  },
  embeddedWalletInfo: '/embedded-wallet/info',
  embeddedWalletIntegration: '/embedded-wallet/integration',
  embeddedWalletSignatures: (uuid: number | string) => {
    return `/embedded-wallet/integrations/${uuid}/signatures`;
  },

  /** Smart contracts */
  smartContracts: (uuid?: string) => {
    return uuid ? `/contracts/${uuid}` : '/contracts';
  },
  smartContractsNew: (contractUuid: string) => {
    return `/contracts/${contractUuid}/deploy`;
  },
  smartContractsDeployed: (uuid?: string) => {
    return uuid ? `/contracts/deployed/${uuid}` : `/contracts/deployed`;
  },
  smartContractsCall: (contractUuid: string) => {
    return `/contracts/deployed/${contractUuid}/call`;
  },

  /**
   * Project settings
   */

  /** Api Keys */
  apiKey: (key?: number | string) => {
    return key ? `/api-keys/${key}` : '/api-keys';
  },
  apiKeyRole: (key: number) => {
    return `/api-keys/${key}/role`;
  },
  apiKeyRoles: (key: number) => {
    return `/api-keys/${key}/roles`;
  },
  apiKeyServiceRoles: (key: number) => {
    return `/api-keys/${key}/service-roles`;
  },

  /**
   * Social
   */
  spaces: (uuid?: number | string) => {
    return uuid ? `/social/spaces/${uuid}` : '/social/spaces';
  },
  spaceActivate: (uuid: number | string) => {
    return `/social/spaces/${uuid}/activate`;
  },
  posts: (uuid?: number | string) => {
    return uuid ? `/social/posts/${uuid}` : `/social/posts`;
  },
  postActivate: (uuid: number | string) => {
    return `/social/posts/${uuid}/activate`;
  },

  /** Oauth links */
  oauthLinks: '/users/oauth-links/',

  /** Discord */
  discordLink: '/users/discord-url/',
  discordConnect: '/users/discord-connect/',
  discordDisconnect: '/users/discord-disconnect/',

  /** Referral */
  referral: '/referral',
  referralGithub: '/referral/github/link',
  referralTwitter: '/referral/twitter/link',
  referralTweets: '/referral/twitter/tweets',
  referralRetweet: '/referral/twitter/confirm',
  referralTwitterAuth: '/referral/twitter/authenticate',
  referralTwitterDisc: '/referral/twitter/unlink',
  referralGithubDisc: '/referral/github/unlink',
  referralRewards: '/referral/products',
  referralClaimReward: '/referral/product',
  airdropTasks: '/referral/airdrop-tasks',
  airdropReviewTasks: '/referral/review-tasks',
  referralClaimParams: '/referral/claim-parameters',

  /** Service status */
  serviceStatus: '/public/service-status',
};

export default Endpoints;
