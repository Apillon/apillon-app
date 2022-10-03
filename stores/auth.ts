import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwt: '',
    email: '',
    username: '',
    avatar: '',
    authStep: '',
  }),
});
