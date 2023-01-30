import { useAuthStore } from '~/stores/auth';

interface RouteInterface {
  name: string;
  redirect: string;
}

const authRoutes: Array<RouteInterface> = [
  { name: 'index', redirect: '/dashboard' },
  { name: 'login', redirect: '/dashboard' },
  { name: 'register', redirect: '/dashboard' },
];

/**
 * Load user data from localStorage into pinia.
 * If no user data in localStorage, logout.
 * Also logout if provider wallet is set and does not match localStorage wallet
 */
export default defineNuxtRouteMiddleware(to => {
  const authStore = useAuthStore();
  authStore.initUser();

  if (authStore.jwt) {
    // Store already init'ed
    $api.setToken(authStore.jwt);

    /** Redirect auth routes */
    for (const route of authRoutes) {
      if (to.name === route.name) {
        return navigateTo(route.redirect, { redirectCode: 301 });
      }
    }
  } else {
    authStore.logout();
  }
});
