import { defineStore } from 'pinia';
import { UserResponse } from '~~/types/auth';

export const AuthLsKeys = {
  AUTH: 'al_auth',
  USER_ID: 'al_userId',
  EMAIL: 'al_email',
  USERNAME: 'al_username',
  WALLET: 'al_wallet',
  PROVIDER: 'al_provider',
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwt: '',
    userId: localStorage.getItem(AuthLsKeys.USER_ID) || '',
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
        await this.getUserData();
      }
    },

    changeUser(userData) {
      this.userId = userData?.user_uuid;
      this.email = userData?.email;
      this.username = userData?.name;
      this.phone = userData?.phone;
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
      const { data, error } = await $api.get<UserResponse>(endpoints.me, null);
      if (error) {
        throw new Error(error.message);
      }

      if (data.data) {
        this.changeUser(data.data);
      }
    },

    logout() {
      this.jwt = '';
      this.username = '';
      this.wallet = '';
      localStorage.removeItem(AuthLsKeys.AUTH);
      localStorage.removeItem(AuthLsKeys.USERNAME);
      localStorage.removeItem(AuthLsKeys.WALLET);
      localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);
      localStorage.removeItem(DataLsKeys.PROJECTS);
      localStorage.removeItem(DataLsKeys.SERVICES);
    },
  },
});
