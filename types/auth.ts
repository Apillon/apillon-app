export {};

declare global {
  /**
   * User
   */
  interface UserInterface {
    id: number;
    email: string;
    name: string;
    phone?: string | null;
    status: number;
    user_uuid: string;
    userPermissions: number[];
    userRoles: number[];
    wallet?: string | null;
    token?: any;
    captchaJwt?: any;
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
  interface SignupForm {
    email: string;
    captcha?: any;
    refCode?: string;
  }
  interface FormRegister {
    password: string | null;
    reenteredPassword: string | null;
  }
  interface PasswordResetForm {
    email: string;
    captcha?: any;
    refCode?: string;
  }
  interface RegisterInterface extends UserInterface {
    token: string;
    captchaJwt?: string;
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
    captcha?: any;
    captchaJwt?: any;
  }
  interface LoginInterface extends UserInterface {
    token: string;
    captchaJwt?: string;
  }

  interface LoginResponse extends GeneralResponse<LoginInterface> {}
  interface PasswordResetRequestResponse extends GeneralResponse<boolean> {}
  interface OAuthSessionInterface {
    data: {
      session: string;
    };
  }
  interface OauthSessionResponse extends GeneralResponse<OAuthSessionInterface> {}
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

  /** Captcha login */
  type CaptchaData = { ts: string; jwt: string };
}
