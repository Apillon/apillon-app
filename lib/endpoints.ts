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
  projects: '/projects/user-projects',
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
  file: '/files/',

  /** Services */
  services: '/services/',

  /** Instructions */
  instruction: '/instructions/',
  instructions: '/instruction/all',

  /** Bucket */
  bucket: '/buckets/',
  bucketWebhook: (buckeId: number, webhookId?: number) => {
    return webhookId ? `/buckets/${buckeId}/webhook/${webhookId}` : `/buckets/${buckeId}/webhook`;
  },

  /** Directories */
  directory: '/directories/',
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

  /** Api Keys */
  apiKey: '/api-keys/',

  /** Billing */
  billing: '/billing/',
};

export default Endpoints;
