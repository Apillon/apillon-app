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

  /** Website */
  website: '/storage/hosting/website',
  websites: (uuid?: string) => {
    return uuid ? `/storage/hosting/websites/${uuid}` : '/storage/hosting/websites';
  },
  websiteDeploy: (uuid?: string) => {
    return `/storage/hosting/websites/${uuid}/deploy`;
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
  collections: (id?: number | string) => {
    return id ? `/nfts/collections/${id}` : '/nfts/collections';
  },
  collectionTransactions: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/transactions`;
  },
  collectionSetBaseUri: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/setBaseUri`;
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
};

export default Endpoints;
