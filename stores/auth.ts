import { defineStore } from 'pinia';
import { UserResponse } from '~~/types/auth';

export const AuthLsKeys = {
  AUTH: 'al_auth',
  EMAIL: 'al_email',
  USERNAME: 'al_username',
  WALLET: 'al_wallet',
  PROVIDER: 'al_provider',
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwt: '',
    email: localStorage.getItem(AuthLsKeys.EMAIL) || '',
    username: localStorage.getItem(AuthLsKeys.USERNAME) || '',
    phone: '',
    provider: parseInt(localStorage.getItem(AuthLsKeys.PROVIDER)) || 0,
    wallet: localStorage.getItem(AuthLsKeys.WALLET) || '',
    authStep: '',
    crypto: null,
  }),
  getters: {
    loggedIn(state) {
      return !!state.email && !!state.username;
    },
    allowedEntry: state => !!state.jwt,
  },
  actions: {
    async initUser() {
      let lsAuth = localStorage.getItem(AuthLsKeys.AUTH) as any;
      if (lsAuth) {
        lsAuth = JSON.parse(lsAuth);

        await this.setUserToken(lsAuth.jwt);
        await this.getUserData();
      }
    },

    changeUser(userData) {
      this.email = userData?.email;
      this.username = userData?.username;
    },

    saveEmail(email: string) {
      this.email = email;
      localStorage.setItem(AuthLsKeys.EMAIL, email);
    },

    async setUserToken(token) {
      this.jwt = token;
      localStorage.setItem(
        AuthLsKeys.AUTH,
        JSON.stringify({
          jwt: token,
        })
      );
      await $api.setToken(token);
    },

    async getUserData() {
      const { data, error } = await $api.get<UserResponse>(endpoints.me, null);
      if (error) {
        throw new Error(error.message);
      }

      if (data.data) {
        await this.changeUser(data.data);
      }
    },

    logout() {
      this.jwt = '';
      this.email = '';
      this.username = '';
      this.wallet = '';
      localStorage.removeItem(AuthLsKeys.AUTH);
      localStorage.removeItem(AuthLsKeys.EMAIL);
      localStorage.removeItem(AuthLsKeys.USERNAME);
      localStorage.removeItem(AuthLsKeys.WALLET);
      localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);
      localStorage.removeItem(DataLsKeys.PROJECTS);
      localStorage.removeItem(DataLsKeys.SERVICES);
    },
  },
});
