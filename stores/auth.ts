import { defineStore } from 'pinia';

export const AuthLsKeys = {
  AUTH: 'al_auth',
  EMAIL: 'al_email',
  USERNAME: 'al_username',
  WALLET: 'al_wallet',
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwt: '',
    email: localStorage.getItem(AuthLsKeys.EMAIL) || '',
    username: localStorage.getItem(AuthLsKeys.USERNAME) || '',
    metamaskWallet: localStorage.getItem(AuthLsKeys.WALLET) || '',
    authStep: '',
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
        this.jwt = lsAuth.jwt;
        await $api.setToken(lsAuth.jwt);
        // await this.getUserData();
      }
    },

    changeUser(userData) {
      this.email = userData?.authUser?.email;
      this.username = userData?.authUser?.username;
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
      // await this.getUserData();
    },

    async getUserData() {
      const res = await $api.get<{
        authUser: { email; username };
        oauth;
        crypto;
        details;
        permissions;
        roles;
      }>(UsersEndpoint.me, null);
      if (res.error) {
        throw new Error(res.error.message);
      }

      if (res.data) {
        await this.changeUser(res.data);
      }
    },

    deleteUser() {
      this.jwt = '';
      this.email = '';
      this.username = '';
      this.metamaskWallet = '';
      localStorage.removeItem(AuthLsKeys.AUTH);
      localStorage.removeItem(AuthLsKeys.EMAIL);
      localStorage.removeItem(AuthLsKeys.USERNAME);
      localStorage.removeItem(AuthLsKeys.WALLET);
    },
    async logout() {
      this.deleteUser();
      const res = await $api.patch(AuthEndpoint.logout);
      if (res.error) {
        alert(res.error.message);
      }
    },
  },
});
