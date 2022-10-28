import { useAuthStore } from '~/stores/auth';

/**
 * Load user data from localStorage into pinia.
 * If no user data in localStorage, logout.
 * Also logout if provider wallet is set and does not match localStorage wallet
 */
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (authStore.jwt) {
    // Store already init'ed
    $api.setToken(authStore.jwt);
    return;
  }

  authStore.initUser();
  if (!authStore.jwt) {
    authStore.logout();
  }
});
