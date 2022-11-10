const Endpoints = {
  /** Auth */
  walletMsg: '/auth/wallet-auth-msg',
  loginWallet: '/auth/loginWallet',

  /** User */
  me: '/users/me',
  login: '/users/login',
  register: '/users/register',
  validateMail: '/users/validate-email',

  /** Project */
  project: '/projects/',
  userProjects: '/projects/user-projects',
  projectUser: '/projects/user/',

  /** File */
  file: '/files/',

  /** Services */
  services: '/services/',

  /** Instructions */
  instruction: '/instruction/',
  instructions: '/instruction/all',

  /** Bucket */
  bucket: '/buckets/',

  /** Directories */
  directory: '/directories/',
  directoryContent: '/directories/directory-content',

  /** Storage */
  storage: '/storage/',
  storageFileUpload: '/storage/file-upload-request',
  storageFileUploadSession: '/storage/file-upload-session',
  storageFileDetails: '/storage/file-details',

  /** Api Keys */
  apiKey: '/api-key/',

  /** Billing */
  billing: '/billing/',
};

export default Endpoints;
