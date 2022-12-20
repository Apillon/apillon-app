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
    provider: 0,
    wallet: '',
    authStep: '',
    crypto: null,
    promises: {
      profile: null as any,
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

    changeUser(userData: Record<string, string | number>) {
      this.userUuid = userData?.user_uuid.toString();
      this.saveEmail(userData.email.toString());

      if (userData.name) {
        this.username = userData?.name.toString();
      }
      if (userData.phone) {
        this.phone = userData?.phone.toString();
      }
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

    async getUserData() {
      try {
        const res = await $api.get<UserResponse>(endpoints.me);

        if (res.data) {
          this.changeUser(res.data);
        }
        return res;
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
