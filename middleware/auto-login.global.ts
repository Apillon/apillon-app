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

const ignoreRoutes: string[] = ['login-admin'];

/**
 * Load user data from localStorage into pinia.
 * If no user data in localStorage, logout.
 * Also logout if provider wallet is set and does not match localStorage wallet
 */
export default defineNuxtRouteMiddleware(to => {
  /** Ignored routes */
  if (ignoreRoutes.includes(to.name as string)) {
    return;
  }

  const authStore = useAuthStore();
  if (authStore.jwt) {
    // Store already init'ed
    $api.setToken(authStore.jwt);
    return;
  }

  const config = useRuntimeConfig();
  $api.setBaseUrl(config.public.apiUrl);

  authStore.initUser();
  if (authStore.jwt) {
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
