import { defineStore } from 'pinia';

export const AuthLsKeys = {
  AUTH: 'al_auth',
  EMAIL: 'al_email',
  WALLET: 'al_wallet',
  CAPTCHA: 'al_captcha',
  PROSOPO: 'al_prosopo',
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    adminSession: false,
    crypto: null,
    email: localStorage.getItem(AuthLsKeys.EMAIL) || '',
    jwt: '',
    loadingProfile: false,
    promises: {
      profile: null as any,
    },
    user: {} as UserInterface,
    wallet: {
      accounts: [] as WalletAccount[],
      address: '',
      provider: getWalletBySource(localStorage.getItem(AuthLsKeys.WALLET)),
      name: localStorage.getItem(AuthLsKeys.WALLET) || '',
      signature: '',
      timestamp: 0,
      isEvmWallet: false,
    },
  }),
  getters: {
    loggedIn(state) {
      return !!state.email && !!state.jwt;
    },
    userId(state) {
      return state.user?.id || 0;
    },
    userUuid(state) {
      return state.user.user_uuid || '';
    },
    username(state) {
      return state.user?.name || '';
    },
    allowedEntry: state => !!state.jwt,
  },
  actions: {
    getUserPermissions() {
      return this.user?.userPermissions || [];
    },

    getUserRoles() {
      return this.user?.userRoles || [];
    },

    isAdmin() {
      return this.adminSession && !!(this.user?.userRoles || []).includes(DefaultUserRole.ADMIN);
    },

    isBetaUser() {
      return !!(this.user?.userRoles || []).includes(DefaultUserRole.BETA_USER);
    },

    isUserAllowed(permission: number) {
      return !!(this.user?.userPermissions || []).includes(permission);
    },

    logout() {
      $api.clearToken();

      this.jwt = '';
      this.wallet.name = '';
      localStorage.removeItem(AuthLsKeys.AUTH);
      localStorage.removeItem(AuthLsKeys.WALLET);
      localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);
    },

    saveEmail(email: string) {
      this.email = email;
      localStorage.setItem(AuthLsKeys.EMAIL, email);
    },

    saveUser(userData: AuthInterface) {
      this.user = { ...userData };
      this.saveEmail(userData.email.toString());

      if (userData.token) {
        this.setUserToken(userData.token);
      }
      if (userData.captchaJwt) {
        this.setCaptchaJwt(userData.captchaJwt, userData.email);
      }
    },

    setUserToken(token: string) {
      this.jwt = token;
      localStorage.setItem(
        AuthLsKeys.AUTH,
        JSON.stringify({
          jwt: token,
        })
      );
      $api.setToken(token);
    },

    setWalletKey(wallet: Wallet) {
      this.wallet.name = wallet.extensionName;
      localStorage.setItem(AuthLsKeys.WALLET, wallet.extensionName);
    },

    getCaptchaLS(): Record<string, any> {
      try {
        const data = JSON.parse(localStorage.getItem(AuthLsKeys.PROSOPO) || '{}');
        return typeof data === 'object' ? data : {};
      } catch (error) {
        console.warn(error);
      }
      return {};
    },

    getCaptchaData(email: string): CaptchaData | null {
      const data = this.getCaptchaLS();
      const emails = Object.keys(data);
      if (emails.includes(email) && data[email].ts && data[email].jwt) {
        return data[email];
      }

      return null;
    },

    setCaptchaJwt(captchaJwt: string, email: string) {
      const data = this.getCaptchaLS();
      data[email] = {
        ts: Date.now().toString(),
        jwt: captchaJwt,
      };
      localStorage.setItem(AuthLsKeys.PROSOPO, JSON.stringify(data));
    },

    removeCaptchaJwt(email?: string) {
      if (email) {
        const data = this.getCaptchaLS();
        const emails = Object.keys(data);
        if (emails.includes(email)) {
          delete data[email];
          localStorage.setItem(AuthLsKeys.PROSOPO, JSON.stringify(data));
        }
      } else {
        localStorage.removeItem(AuthLsKeys.PROSOPO);
      }
    },

    /**
     * API calls
     */
    async initUser() {
      let lsAuth = localStorage.getItem(AuthLsKeys.AUTH) as any;
      if (lsAuth) {
        lsAuth = JSON.parse(lsAuth);

        this.setUserToken(lsAuth.jwt);
        this.promises.profile = await this.getUserData();
      }

      if (this.wallet.provider) {
        this.setWallet(this.wallet.provider);
      }
    },

    async getUserData() {
      this.loadingProfile = true;
      try {
        const res = await $api.get<UserResponse>(endpoints.me);

        if (res.data) {
          this.saveUser(res.data);
        }
        setTimeout(() => {
          this.loadingProfile = false;
        }, 10);

        return res;
      } catch (error) {
        /** On error - logout */
        this.logout();

        const router = useRouter();
        router.push('/login');

        setTimeout(() => {
          this.loadingProfile = false;
        }, 700);
        return null;
      }
    },

    /** wallet */
    async getAuthMsg(): Promise<WalletMsgInterface> {
      try {
        const res = await $api.get<WalletMsgResponse>(endpoints.walletMsg);

        return res.data;
      } catch (error) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as WalletMsgInterface;
    },

    async setWallet(wallet: Wallet) {
      await wallet.enable();
      this.wallet.accounts = (await wallet.getAccounts()) || [];

      this.wallet.provider = wallet;
      this.setWalletKey(wallet);
    },
  },
});
