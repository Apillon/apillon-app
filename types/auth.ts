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
  interface FormRegister {
    password: string;
    reenteredPassword: string;
  }
  interface RegisterResponse {
    data: {
      id: number;
      status: number;
      name: string;
      token: string;
    };
    status: number;
  }
  interface ValidateMailResponse {
    data: {
      data: boolean;
      status: number;
      success: boolean;
    };
    status: number;
  }
  interface PasswordResetForm {
    email: string;
  }
  interface PasswordResetResponse extends GeneralResponse<boolean> {}

  /**
   * User
   */
  interface UserInterface {
    id: number;
    email: string;
    name: string;
    phone: string;
    status: number;
    user_uuid: string;
  }

  interface UserResponse extends GeneralResponse<UserInterface> {}

  /**
   * User profile
   */
  interface FormUserProfile {
    name?: string | null;
    email: string;
    phone?: string | null;
  }
  interface UserProfileResponse extends GeneralResponse<UserInterface> {}

  /**
   * User invite
   */
  interface FormUserInvite {
    email: string;
    role_id: number | null;
  }

  /**
   * Login
   */
  interface FormLogin {
    email: string;
    password: string;
  }
  interface LoginInterface extends UserInterface {
    token: string;
  }
  interface LoginResponse extends GeneralResponse<LoginInterface> {}
  interface PasswordResetRequestResponse extends GeneralResponse<boolean> {}

  /**
   * Wallet
   */
  interface WalletResponse {
    data: {
      message: string;
      timestamp: number;
    };
    status: number;
  }
  interface WalletLoginResponse {
    data: {
      authToken: string;
    };
    status: number;
  }
}
