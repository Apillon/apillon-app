export enum AuthStep {
  SIGN_UP = 'signup',
  SIGN_UP_EMAIL = 'signUpEmail',
  SIGN_UP_CONFIRMED = 'signUpConfirmed',
  LOGIN = 'login',
  LOGIN_FIRST = 'loginFirst',
  LOGIN_FIRST_PROJECT = 'loginFirstProject',
  LOGIN_FIRST_PROJECT_BUILD = 'loginFirstProjectBuild',
}

export interface AuthInterface extends Record<string, any> {
  url: String;
  apiUrl: String;
}

export default AuthStep;
