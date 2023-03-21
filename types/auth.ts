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
   * User
   */
  interface UserInterface {
    id: number;
    email: string;
    name: string;
    phone: string;
    status: number;
    user_uuid: string;
    userRoles: number[];
    token?: any;
    wallet?: string | null;
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
   *  Register
   */
  interface FormRegister {
    password: string | null;
    reenteredPassword: string | null;
  }
  interface PasswordResetForm {
    email: string;
  }
  interface RegisterInterface extends UserInterface {
    token: string;
  }
  interface ValidateMailInterface {
    data: {
      result: boolean;
    };
    status: number;
    success: boolean;
  }

  interface RegisterResponse extends GeneralResponse<RegisterInterface> {}
  interface ValidateMailResponse extends GeneralResponse<ValidateMailInterface> {}
  interface PasswordResetResponse extends GeneralResponse<boolean> {}

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
  interface WalletMsgInterface {
    message: string;
    timestamp: number;
  }
  interface WalletLoginInterface extends UserInterface {
    authToken: string;
  }
  interface WalletMsgResponse extends GeneralResponse<WalletMsgInterface> {}
  interface WalletLoginResponse extends GeneralResponse<WalletLoginInterface> {}

  type AuthInterface = LoginInterface | UserInterface | WalletLoginInterface;
}
