export enum AuthStep {
  SIGN_UP = 'signup',
  SIGN_UP_EMAIL = 'signUpEmail',
  SIGN_UP_CONFIRMED = 'signUpConfirmed',
  LOGIN = 'login',
  LOGIN_FIRST = 'loginFirst',
  LOGIN_FIRST_PROJECT = 'loginFirstProject',
  LOGIN_FIRST_PROJECT_BUILD = 'loginFirstProjectBuild',
  PASSWORD_RESET = 'passwordReset',
}

declare global {
  /**
   *  Register
   */
  export interface FormRegister {
    password: string;
    reenteredPassword: string;
  }
  export interface RegisterResponse {
    data: {
      id: number;
      status: number;
      name: string;
      token: string;
    };
    status: number;
  }
  export interface ValidateMailResponse {
    data: {
      data: boolean;
      status: number;
      success: boolean;
    };
    status: number;
  }
  export interface PasswordResetForm {
    email: string;
  }
  export interface PasswordResetResponse {
    data: boolean;
    status: number;
  }

  /**
   * Login
   */
  export interface FormLogin {
    email: string;
    password: string;
  }
  export interface LoginResponse {
    data: {
      token: string;
    };
    status: number;
  }
  export interface PasswordResetRequestResponse {
    data: boolean;
    status: number;
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
    name?: string | null;
    email: string;
    phone?: string | null;
  }

  export interface UserProfileResponse {
    data: {
      email: string;
      id: number;
      name: string;
      phone: string;
      status: number;
      user_uuid: string;
    };
    status: number;
  }

  /**
   * User invite
   */
  export interface FormUserInvite {
    email: string;
    role_id: number | null;
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

  /**
   * Wallet
   */
  export interface WalletResponse {
    data: {
      message: string;
      timestamp: number;
    };
    status: number;
  }
  export interface WalletLoginResponse {
    data: {
      authToken: string;
    };
    status: number;
  }

  
}
