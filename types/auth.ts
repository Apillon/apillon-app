export enum AuthStep {
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
export interface UserResponse {
  data: {
    id: number;
    status: number;
    name: string;
    user_uuid: string;
  };
  status: number;
}

/**
 * User profile
 */
export interface FormUserProfile {
  username: string;
  email: string;
  phone: string;
}

export interface UserProfileResponse {
  data: {
    id: number;
    status: number;
    name: string;
    user_uuid: string;
  };
  status: number;
}

/**
 * User invite
 */
export interface FormUserInvite {
  email: string;
  role: string;
}

export interface UserInviteResponse {
  data: {
    id: number;
    status: number;
    name: string;
    user_uuid: string;
  };
  status: number;
}
