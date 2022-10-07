export enum AuthStep {
  SIGN_UP = 'signup',
  SIGN_UP_CONFIRM = 'signUpConfirm',
  SIGN_UP_CONFIRMED = 'signUpConfirmed',
  LOGIN = 'login',
  LOGIN_FIRST = 'loginFirst',
  LOGIN_FIRST_PROJECT = 'loginFirstProject',
  LOGIN_FIRST_PROJECT_BUILD = 'loginFirstProjectBuild',
}

export default interface AuthInterface extends Record<string, any> {
  url: String;
  apiUrl: String;
}
