import { defineStore } from 'pinia';
import { DataLsKeys } from './data';

export const AuthLsKeys = {
  AUTH: 'al_auth',
  EMAIL: 'al_email',
  WALLET: 'al_wallet',
  PROVIDER: 'al_provider',
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authStep: '',
    crypto: null,
    email: localStorage.getItem(AuthLsKeys.EMAIL) || '',
    jwt: '',
    loadingProfile: false,
    promises: {
      profile: null as any,
    },
    provider: 0,
    user: {} as UserInterface,
    wallet: '',
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
    async initUser() {
      let lsAuth = localStorage.getItem(AuthLsKeys.AUTH) as any;
      if (lsAuth) {
        lsAuth = JSON.parse(lsAuth);

        this.setUserToken(lsAuth.jwt);
        this.promises.profile = await this.getUserData();
      }
    },

    changeUser(userData: UserInterface) {
      this.user = { ...userData };
      this.saveEmail(userData.email.toString());
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

    getUserRoles() {
      return this.user?.userRoles || [];
    },

    isBetaUser() {
      return !!(this.user?.userRoles || []).includes(DefaultUserRole.BETA_USER);
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

    logout() {
      $api.clearToken();

      this.jwt = '';
      this.wallet = '';
      localStorage.removeItem(AuthLsKeys.AUTH);
      localStorage.removeItem(AuthLsKeys.WALLET);
      localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);
    },
  },
});
