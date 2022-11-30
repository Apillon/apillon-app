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
    jwt: '',
    userUuid: '',
    email: localStorage.getItem(AuthLsKeys.EMAIL) || '',
    username: '',
    phone: '',
    provider: parseInt(localStorage.getItem(AuthLsKeys.PROVIDER)) || 0,
    wallet: localStorage.getItem(AuthLsKeys.WALLET) || '',
    authStep: '',
    crypto: null,
    promises: {
      profile: null,
    },
  }),
  getters: {
    loggedIn(state) {
      return !!state.email && !!state.jwt;
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

    changeUser(userData) {
      this.userUuid = userData?.user_uuid;
      this.username = userData?.name;
      this.phone = userData?.phone;
      this.saveEmail(userData?.email);
    },

    saveEmail(email: string) {
      this.email = email;
      localStorage.setItem(AuthLsKeys.EMAIL, email);
    },

    setUserToken(token) {
      this.jwt = token;
      localStorage.setItem(
        AuthLsKeys.AUTH,
        JSON.stringify({
          jwt: token,
        })
      );
      $api.setToken(token);
    },

    async getUserData() {
      try {
        const { response, data, error } = await $api.get<UserResponse>(endpoints.me, null);

        if (error) {
          this.promises.profile = null;
          throw new Error(error.message);
        }

        if (data.data) {
          this.changeUser(data.data);
        }
        return response;
      } catch (error) {
        console.warn(error);
        return null;
      }
    },

    logout() {
      $api.clearToken();

      this.jwt = '';
      this.username = '';
      this.wallet = '';
      localStorage.removeItem(AuthLsKeys.AUTH);
      localStorage.removeItem(AuthLsKeys.WALLET);
      localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);
    },
  },
});
