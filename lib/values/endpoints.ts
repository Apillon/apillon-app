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
  project: (projectUuid: string) => `/projects/${projectUuid}`,
  projectOverview: (projectUuid: string) => `/projects/${projectUuid}/overview`,
  projectUsers: (projectUuid: string) => `/projects/${projectUuid}/users`,
  projectInviteUser: (projectUuid: string) => `/projects/${projectUuid}/invite-user`,
  projectUser: (id: number) => `/projects/user/${id}`,
  projectUserUninvite: (projectUuid: string) => `/projects/${projectUuid}/uninvite-user`,

  /** Payments */
  credit: (projectUuid: string) => `/projects/${projectUuid}/credit`,
  creditSettings: (projectUuid: string) => `/projects/${projectUuid}/credit-settings`,
  creditTransactions: (projectUuid: string) => `/projects/${projectUuid}/credit/transactions`,
  activeSubscription: (projectUuid: string) => `/projects/${projectUuid}/active-subscription`,
  getRpcPlan: (projectUuid: string) => `/projects/${projectUuid}/rpc-plan`,
  subscriptions: (projectUuid: string) => `/projects/${projectUuid}/subscriptions`,
  invoices: (projectUuid: string) => `/projects/${projectUuid}/invoices`,
  productPrice: (productId?: string | number) =>
    productId ? `/payments/products/${productId}/price` : '/payments/products/price-list',
  crypto: (id?: string | number) => (id ? `/payments/crypto/payment/${id}` : '/payments/crypto/payment'),
  creditSessionUrl: '/payments/stripe/credit-session-url',
  subscriptionSessionUrl: '/payments/stripe/subscription-session-url',
  customerPortalUrl: '/payments/stripe/customer-portal-session-url',
  creditPackages: '/payments/credit/packages',
  subscriptionPackages: '/payments/subscription/packages',

  /** Services */
  serviceTypes: '/services/types',
  services: (id?: number | string) => (id ? `/services/${id}` : '/services'),

  /** Instructions */
  instructions: (key?: string) => (key ? `/instructions/${key}` : '/instructions'),

  /** Asset Hub */
  assets: (uuid?: string) => (uuid ? `/asset-hub/${uuid}` : '/asset-hub'),

  /** Bucket */
  buckets: '/buckets/',
  bucket: (bucketUuid: string) => `/buckets/${bucketUuid}`,
  bucketContent: (bucketUuid: string) => `/buckets/${bucketUuid}/content`,
  bucketRestore: (bucketUuid: string) => `/buckets/${bucketUuid}/cancel-deletion`,
  bucketWebhook: (bucketUuid: string, webhookId?: number) =>
    webhookId ? `/buckets/${bucketUuid}/webhook/${webhookId}` : `/buckets/${bucketUuid}/webhook`,

  /** Directories */
  directory: (id?: string) => (id ? `/directories/${id}` : '/directories'),
  directoryContent: '/directories/directory-content',

  /** File */
  file: (key?: string) => (key ? `/files/${key}` : '/files'),

  /** Storage */
  storage: '/storage/',
  storageInfo: '/storage/info',
  storageFileUpload: (bucketUuid: string, sessionUuid?: string) =>
    sessionUuid ? `/storage/${bucketUuid}/file-upload/${sessionUuid}/end` : `/storage/${bucketUuid}/file-upload`,
  storageFilesUpload: (bucketUuid: string) => `/storage/${bucketUuid}/files-upload`,
  storageFileUploads: (bucketUuid: string) => `/storage/${bucketUuid}/file-uploads`,
  storageFileUploadSessions: (bucketUuid: string) => `/storage/${bucketUuid}/file-upload-sessions`,
  storageFileDetails: (bucketUuid: string, fileUuid: string) => `/storage/${bucketUuid}/file/${fileUuid}/detail`,
  storageSyncToIpfs: (bucketUuid: string, fileUuid: string) => `/storage/${bucketUuid}/file/${fileUuid}/sync-to-ipfs`,
  storageFileDelete: (bucketUuid: string, fileUuid: string | number) => `/storage/${bucketUuid}/file/${fileUuid}`,
  storageFileRestore: (bucketUuid: string, fileUuid: string | number) =>
    `/storage/${bucketUuid}/file/${fileUuid}/restore`,
  storageFilesTrashed: (bucketUuid: string) => `/storage/${bucketUuid}/trashed-files`,
  linkGithub: '/deploy/github/link',
  unlinkGithub: '/deploy/github/unlink',
  githubProjectConfig: (projectUuid: string) => `/deploy/project-config/${projectUuid}`,
  githubRepos: (projectUuid: string) => `/deploy/github/list-repos/${projectUuid}`,
  deployConfig: (id?: string | number) => (id ? `/deploy/config/${id}` : '/deploy/config'),
  redeploy: (websiteUuid: string) => `/deploy/${websiteUuid}/redeploy`,
  deployNftWebsite: `/deploy/nft`,

  /** IPNS */
  ipns: (bucketUuid: string, uuid?: string) =>
    uuid ? `/buckets/${bucketUuid}/ipns/${uuid}` : `/buckets/${bucketUuid}/ipns`,
  ipnsPublish: (bucketUuid: string, uuid: string) => `/buckets/${bucketUuid}/ipns/${uuid}/publish`,

  /** IPFS */
  ipfsInfo: '/storage/ipfs-cluster-info',
  ipfsLink: '/storage/link-on-ipfs/',
  ipfsLinks: '/storage/link-on-ipfs-multiple',

  /**
   * Hosting
   */
  shortUrl: '/storage/hosting/short-url',

  /** Website */
  website: '/storage/hosting/website',
  websites: (uuid?: string) => (uuid ? `/storage/hosting/websites/${uuid}` : '/storage/hosting/websites'),
  websiteDeploy: (uuid?: string) => `/storage/hosting/websites/${uuid}/deploy`,
  websiteActivate: (uuid?: string) => `/storage/hosting/websites/${uuid}/activate`,
  websiteDomain: (uuid?: string) => `/storage/hosting/websites/${uuid}/domain`,
  websiteDomainStatus: (uuid?: string) => `/storage/hosting/websites/${uuid}/check-domain`,

  /** Deployment */
  deployment: (websiteUuid: string, deploymentUuid: string) =>
    `/storage/hosting/websites/${websiteUuid}/deployments/${deploymentUuid}`,
  deployments: (websiteUuid: string) => `/storage/hosting/websites/${websiteUuid}/deployments`,
  deploymentBuilds: `/deploy/deploy-build`,
  deploymentConfig: (websiteUuid: string) => `/deploy/config/${websiteUuid}`,
  deploymentConfigVariables: (deploymentConfigId?: number) =>
    deploymentConfigId ? `/deploy/config/variables/${deploymentConfigId}` : '/deploy/config/variables',

  /**
   * NFT
   */
  nftCheckTransactionsStatus: '/nfts/check-transactions-status',
  nftDeploy: (collectionUuid: string) => `/nfts/collections/${collectionUuid}/deploy`,

  /** Collection */
  collectionsSubstrate: '/nfts/collections/substrate',
  collectionsQuota: '/nfts/collections/quota-reached',
  collectionsUnique: '/nfts/collections/unique',
  collections: (id?: string) => (id ? `/nfts/collections/${id}` : '/nfts/collections'),
  collectionTransactions: (collectionUuid: string) => `/nfts/collections/${collectionUuid}/transactions`,
  collectionSetBaseUri: (collectionUuid: string) => `/nfts/collections/${collectionUuid}/set-base-uri`,
  collectionTransferOwnership: (collectionUuid: string) => `/nfts/collections/${collectionUuid}/transferOwnership`,
  collectionBurn: (collectionUuid: string) => `/nfts/collections/${collectionUuid}/burn`,
  collectionMint: (collectionUuid: string) => `/nfts/collections/${collectionUuid}/mint`,
  collectionNestMint: (collectionUuid: string) => `/nfts/collections/${collectionUuid}/nest-mint`,
  collectionNftsMetadata: (collectionUuid: string) => `/nfts/collections/${collectionUuid}/nfts-metadata`,
  collectionIpns: (id: string) => `/nfts/collections/${id}/ipns`,
  collectionActivate: (collectionUuid: string) => `/nfts/collections/${collectionUuid}/activate`,

  /**
   * Computing
   */
  /** Contracts */
  contracts: (uuid?: string) => (uuid ? `/computing/contracts/${uuid}` : '/computing/contracts'),
  contractAssignCid: (uuid?: string) => `/computing/contracts/${uuid}/assign-cid-to-nft`,
  contractEncrypt: (uuid?: string) => `/computing/contracts/${uuid}/encrypt`,
  contractTransferOwnership: (uuid: string) => `/computing/contracts/${uuid}/transfer-ownership`,
  contractTransactions: (contractUuid: string) => `/computing/contracts/${contractUuid}/transactions`,
  contractActivate: (contractUuid: string) => `/computing/contracts/${contractUuid}/activate`,

  /** Cloud functions - Acurast */
  cloudFunctions: (uuid?: string) => (uuid ? `/acurast/cloud-functions/${uuid}` : '/acurast/cloud-functions'),
  cloudFunctionActivate: (uuid: string) => `/acurast/cloud-functions/${uuid}/activate`,
  cloudFunctionEnvironment: (uuid: string) => `/acurast/cloud-functions/${uuid}/environment`,
  cloudFunctionExecute: (uuid: string) => `/acurast/cloud-functions/${uuid}/execute`,
  cloudFunctionJobs: (uuid: string) => `/acurast/cloud-functions/${uuid}/jobs`,
  cloudFunctionUsage: (uuid: string) => `/acurast/cloud-functions/${uuid}/usage`,
  acurastJobs: (uuid: string) => `/acurast/jobs/${uuid}`,

  /** Embedded wallet */
  embeddedWallets: (uuid?: number | string) =>
    uuid ? `/embedded-wallet/integrations/${uuid}` : '/embedded-wallet/integrations',
  embeddedWalletInfo: '/embedded-wallet/info',
  embeddedWalletIntegration: '/embedded-wallet/integration',
  embeddedWalletSignatures: (uuid: number | string) => `/embedded-wallet/integrations/${uuid}/signatures`,

  /** Smart contracts */
  smartContracts: (uuid?: string) => (uuid ? `/contracts/${uuid}` : '/contracts'),
  smartContractsNew: (contractUuid: string) => `/contracts/${contractUuid}/deploy`,
  smartContractsDeployed: (uuid?: string) => (uuid ? `/contracts/deployed/${uuid}` : `/contracts/deployed`),
  smartContractsCall: (contractUuid: string) => `/contracts/deployed/${contractUuid}/call`,
  smartContractsActivate: (uuid: number | string) => `/contracts/deployed/${uuid}/activate`,

  /** Indexers */
  indexers: (uuid?: string) => (uuid ? `/indexing/indexers/${uuid}` : '/indexing/indexers'),
  indexer: () => '/indexing/indexer',
  indexerLogs: (uuid: string) => `/indexing/indexers/${uuid}/logs`,
  indexerDeployments: (uuid: string) => `/indexing/indexers/${uuid}/deployments`,
  indexerHibernate: (uuid: string) => `/indexing/indexers/${uuid}/hibernate`,
  indexerUsage: (uuid: string) => `/indexing/indexers/${uuid}/usage`,
  indexerBilling: (uuid: string) => `/indexing/indexers/${uuid}/billing`,

  /**
   * RPC
   */
  rpcApiKeys: (id?: number) => `/rpc/api-key${id ? `/${id}` : ''}`,
  rpcFavoriteEndpoints: (apiKeyId: number) => `/rpc/api-key/${apiKeyId}/urls`,
  rpcEndpoints: () => '/rpc/endpoints',
  rpcApiKeysQuotaReached: () => '/rpc/api-key/quota-reached',
  rpcUrl: (id?: number) => `/rpc/url${id ? `/${id}` : ''}`,
  rpcDwellirId: () => '/rpc/dwellir-id',
  rpcApiKeyUsage: (projectUuid: string, apiKeyId: number) => `/rpc/${projectUuid}/api-key/${apiKeyId}/usage`,
  rpcApiKeyUsagePerChain: (projectUuid: string, apiKeyId: number) =>
    `/rpc/${projectUuid}/api-key/${apiKeyId}/usage-per-chain`,

  /**
   * Project settings
   */

  /** Api Keys */
  apiKey: (key?: number | string) => (key ? `/api-keys/${key}` : '/api-keys'),
  apiKeyRole: (key: number) => `/api-keys/${key}/role`,
  apiKeyRoles: (key: number) => `/api-keys/${key}/roles`,
  apiKeyServiceRoles: (key: number) => `/api-keys/${key}/service-roles`,

  /**
   * Social
   */
  spaces: (uuid?: number | string) => (uuid ? `/social/spaces/${uuid}` : '/social/spaces'),
  spaceActivate: (uuid: number | string) => `/social/spaces/${uuid}/activate`,
  posts: (uuid?: number | string) => (uuid ? `/social/posts/${uuid}` : `/social/posts`),
  postActivate: (uuid: number | string) => `/social/posts/${uuid}/activate`,

  /**
   * Simplets
   */
  simplets: (uuid?: number | string) => (uuid ? `/simplets/${uuid}` : '/simplets'),
  simpletActivate: (uuid: number | string) => `/simplets/${uuid}/activate`,
  simpletDeploy: (uuid: number | string) => `/simplets/${uuid}/deploy`,
  simpletDeployed: (uuid?: number | string) => (uuid ? `/simplets/deployed/${uuid}` : `/simplets/deployed/`),
  simpletRedeploy: (uuid: number | string) => `/simplets/deployed/${uuid}/redeploy`,

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

  /** Statistics */
  statistics: '/public/statistics',

  /** Notifications */
  notification: '/notification',
};

export default Endpoints;
