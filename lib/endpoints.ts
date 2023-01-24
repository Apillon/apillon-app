const Endpoints = {
  /** Auth */
  walletMsg: '/auth/wallet-auth-msg',
  loginWallet: '/auth/loginWallet',

  /** User */
  me: '/users/me',
  login: '/users/login',
  register: '/users/register',
  validateMail: '/users/validate-email',
  passwordReset: '/users/password-reset',
  passwordResetRequest: '/users/password-reset-request',

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

  /** File */
  file: (key?: number) => {
    return key ? `/files/${key}` : '/files';
  },

  /** Services */
  services: '/services/',

  /** Instructions */
  instructions: (key?: string) => {
    return key ? `/instructions/${key}` : '/instructions';
  },

  /** Bucket */
  buckets: '/buckets/',
  bucketsQuota: '/buckets/quota-reached',
  bucket: (buckeId: number) => {
    return `/buckets/${buckeId}`;
  },
  bucketWebhook: (buckeId: number, webhookId?: number) => {
    return webhookId ? `/buckets/${buckeId}/webhook/${webhookId}` : `/buckets/${buckeId}/webhook`;
  },

  /** Directories */
  directory: (id?: number) => {
    return id ? `/directories/${id}` : '/directories';
  },
  directoryContent: '/directories/directory-content',

  /** Storage */
  storage: '/storage/',
  storageFileUpload: (bucketUuid: string, sessionUuid?: string) => {
    return sessionUuid
      ? `/storage/${bucketUuid}/file-upload/${sessionUuid}/end`
      : `/storage/${bucketUuid}/file-upload`;
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

  /** Billing */
  billing: '/billing/',
};

export default Endpoints;
