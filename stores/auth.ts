import { defineStore } from 'pinia';

export const AuthLsKeys = {
  AUTH: 'al_auth',
  EMAIL: 'al_email',
  WALLET: 'al_wallet',
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
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
    },
  }),
  getters: {
    loggedIn(state) {
      return !!state.email && !!state.jwt;
    },
    userId(state) {
      return state.user.id;
    },
    userUuid(state) {
      return state.user.user_uuid;
    },
    username(state) {
      return state.user.name;
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

    /**
     * API cals
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
        this.loadingProfile = false;

        return res;
      } catch (error) {
        /** On error - logout */
        this.logout();

        setTimeout(() => {
          this.loadingProfile = false;
        }, 300);
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
