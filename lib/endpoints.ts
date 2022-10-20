export const AuthEndpoint = {
  emailCheck: '/auth/userExists',
  login: '/auth/login',
  logout: '/auth/logout',
  reset: '/auth/password/reset',
  resetRequest: '/auth/password/reset/request ',
};

export const UsersEndpoint = {
  me: '/users/me',
  register: '/user/register',
  confirm: '/user/confirm ',
  details: '/user/details',
  connectWallet: '/users/connect-wallet',
  removeWallet: '/users/remove-wallet',
};

export const ProjectEndpoint = {
  project: '/project/',
  projectUsers: '/project/getProjectUsers',
};

export const ServiceEndpoint = {
  services: '/services/',
};
