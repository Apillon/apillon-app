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
  register: '/users/register',
  validateMail: '/users/validate-email',
  passwordReset: '/users/password-reset',
  passwordResetRequest: '/users/password-reset-request',

  /**
   * Dashboard
   */

  /** Project */
  projects: '/projects',
  projectsQuota: '/projects/qouta-reached',
  projectsUserProjects: '/projects/user-projects',
  project: (projectId: number) => {
    return `/projects/${projectId}`;
  },
  projectUsers: (projectId: number) => {
    return `/projects/${projectId}/users`;
  },
  projectInviteUser: (projectId: number) => {
    return `/projects/${projectId}/invite-user`;
  },
  projectUserRole: (id: number) => {
    return `/projects/user/${id}`;
  },

  /** Services */
  services: (id?: number) => {
    return id ? `/services/${id}` : '/services';
  },

  /** Instructions */
  instructions: (key?: string) => {
    return key ? `/instructions/${key}` : '/instructions';
  },

  /**
   * Storage
   */

  /** Bucket */
  buckets: '/buckets/',
  bucketsQuota: '/buckets/quota-reached',
  bucket: (buckeId: number | string) => {
    return `/buckets/${buckeId}`;
  },
  bucketContent: (buckeId: number) => {
    return `/buckets/${buckeId}/content`;
  },
  bucketRestore: (buckeId: number) => {
    return `/buckets/${buckeId}/cancel-deletion`;
  },
  bucketWebhook: (buckeId: number, webhookId?: number) => {
    return webhookId ? `/buckets/${buckeId}/webhook/${webhookId}` : `/buckets/${buckeId}/webhook`;
  },

  /** Directories */
  directory: (id?: number) => {
    return id ? `/directories/${id}` : '/directories';
  },
  directoryContent: '/directories/directory-content',

  /** File */
  file: (key?: number) => {
    return key ? `/files/${key}` : '/files';
  },

  /** Storage */
  storage: '/storage/',
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
    return `/storage/${bucketUuid}/file/${fileUuid}/cancel-deletion`;
  },
  storageFilesTrashed: (bucketUuid: string) => {
    return `/storage/${bucketUuid}/trashed-files`;
  },
  /** IPNS */
  ipns: (bucketId: number, id?: number) => {
    return id ? `/buckets/${bucketId}/ipns/${id}` : `/buckets/${bucketId}/ipns`;
  },
  ipnsPublish: (bucketId: number, id: number) => {
    return `/buckets/${bucketId}/ipns/${id}/publish`;
  },

  /**
   * Hosting
   */

  /** Website */
  website: '/storage/hosting/website',
  websites: (id?: number) => {
    return id ? `/storage/hosting/websites/${id}` : '/storage/hosting/websites';
  },
  websiteQuota: `/storage/hosting/websites/quota-reached`,
  websiteDeploy: (id?: number) => {
    return `/storage/hosting/websites/${id}/deploy`;
  },

  /** Deployment */
  deployment: (websiteId: number, id: number) => {
    return `/storage/hosting/websites/${websiteId}/deployments/${id}`;
  },
  deployments: (websiteId: number) => {
    return `/storage/hosting/websites/${websiteId}/deployments`;
  },

  /**
   * NFT
   */
  nftCheckTransactionsStatus: '/nfts/check-transactions-status',
  nftDeploy: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/deploy`;
  },

  /** Collection */
  collections: (id?: number) => {
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
  collectionMint: (collectionUuid: string) => {
    return `/nfts/collections/${collectionUuid}/mint`;
  },
  collectionQuota: '/nfts/collections/quota-reached',

  /**
   * Project settings
   */

  /** Api Keys */
  apiKey: (key?: number) => {
    return key ? `/api-keys/${key}` : '/api-keys';
  },
  apiKeyRole: (key: number) => {
    return `/api-keys/${key}/role`;
  },
  apiKeyRoles: (key: number) => {
    return `/api-keys/${key}/roles`;
  },

  /** Oauth links */
  oauthLinks: '/users/oauth-links/',

  /** Discord */
  discordLink: '/users/discord-url/',
  discordConnect: '/users/discord-connect/',
  discordDisconnect: '/users/discord-disconnect/',

  /** Billing */
  billing: '/billing/',

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
