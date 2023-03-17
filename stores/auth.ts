import { lstat } from 'fs';
import { defineStore } from 'pinia';
import { DataLsKeys } from './data';

export const AuthLsKeys = {
  AUTH: 'al_auth',
  EMAIL: 'al_email',
  WALLET: 'al_wallet',
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accounts: [] as WalletAccount[],
    authStep: '',
    crypto: null,
    email: localStorage.getItem(AuthLsKeys.EMAIL) || '',
    jwt: '',
    loadingProfile: false,
    promises: {
      profile: null as any,
    },
    user: {} as UserInterface,
    wallet: getWalletBySource(localStorage.getItem(AuthLsKeys.WALLET)) || ({} as Wallet),
    walletKey: localStorage.getItem(AuthLsKeys.WALLET) || '',
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
    phone(state) {
      return state.user.phone;
    },
    allowedEntry: state => !!state.jwt,
  },
  actions: {
    changeUser(userData: UserInterface) {
      this.user = { ...userData };
      this.saveEmail(userData.email.toString());
    },

    getUserRoles() {
      return this.user?.userRoles || [];
    },

    isBetaUser() {
      return !!(this.user?.userRoles || []).includes(DefaultUserRole.BETA_USER);
    },

    logout() {
      $api.clearToken();

      this.jwt = '';
      this.walletKey = '';
      localStorage.removeItem(AuthLsKeys.AUTH);
      localStorage.removeItem(AuthLsKeys.WALLET);
      localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);
    },

    saveEmail(email: string) {
      this.email = email;
      localStorage.setItem(AuthLsKeys.EMAIL, email);
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
      this.walletKey = wallet.extensionName;
      localStorage.setItem(AuthLsKeys.WALLET, wallet.extensionName);
    },

    async initUser() {
      let lsAuth = localStorage.getItem(AuthLsKeys.AUTH) as any;
      if (lsAuth) {
        lsAuth = JSON.parse(lsAuth);

        this.setUserToken(lsAuth.jwt);
        this.promises.profile = await this.getUserData();
      }
    },

    async getUserData() {
      this.loadingProfile = true;
      try {
        const res = await $api.get<UserResponse>(endpoints.me);

        if (res.data) {
          this.changeUser(res.data);
        }
        this.loadingProfile = false;
        return res;
      } catch (error) {
        /** On error - logout */
        this.logout();

        this.loadingProfile = false;
        return null;
      }
    },

    async setWallet(wallet: Wallet) {
      this.wallet = wallet;
      this.setWalletKey(wallet);

      console.log(wallet);
      console.log(await wallet.getAccounts());

      await wallet.enable();

      this.accounts = (await wallet.getAccounts()) || [];
    },
  },
});
