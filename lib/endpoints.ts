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
  project: '/projects/',
  userProjects: '/projects/user-projects',
  projectUser: '/projects/user/',

  /** File */
  file: '/files/',

  /** Services */
  services: '/services/',

  /** Instructions */
  instruction: '/instructions/',
  instructions: '/instruction/all',

  /** Bucket */
  bucket: '/buckets/',

  /** Directories */
  directory: '/directories/',
  directoryContent: '/directories/directory-content',

  /** Storage */
  storage: '/storage/',

  /** Api Keys */
  apiKey: '/api-keys/',

  /** Billing */
  billing: '/billing/',
};

export default Endpoints;
