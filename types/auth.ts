enum AuthStep {
  SIGN_UP = 'signup',
  SIGN_UP_EMAIL = 'signUpEmail',
  SIGN_UP_CONFIRMED = 'signUpConfirmed',
  LOGIN = 'login',
  LOGIN_FIRST = 'loginFirst',
  LOGIN_FIRST_PROJECT = 'loginFirstProject',
  LOGIN_FIRST_PROJECT_BUILD = 'loginFirstProjectBuild',
}

/**
 * User
 */
interface UserResponse {
  data: {
    id: number;
    status: number;
    name: string;
    user_uuid: string;
  };
  status: number;
}

export { AuthStep, UserResponse };
