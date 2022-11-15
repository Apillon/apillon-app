import { removeLastSlash } from '~/lib/utils';
import { useAuthStore } from '~/stores/auth';
interface ProtectedRouteInterface {
  path?: string;
  regex?: RegExp;
  redirect: string;
}

const protectedRoutes: Array<ProtectedRouteInterface> = [
  { regex: /^\/dashboard/, redirect: '/login' },
  { path: '/profile', redirect: '/login' },
];

/**
 * Redirect user to landing page if not logged in and trying to access protected routes
 */
export default defineNuxtRouteMiddleware(to => {
  const decodedUrl = removeLastSlash(decodeURI(to.path));
  const authStore = useAuthStore();
  for (const protectedRoute of protectedRoutes) {
    if ((!protectedRoute.path && !protectedRoute.regex) || !protectedRoute.redirect) {
      continue;
    }
    if (
      ((protectedRoute.regex && protectedRoute.regex.test(decodedUrl)) ||
        decodedUrl === protectedRoute.path) &&
      !authStore.allowedEntry
    ) {
      return navigateTo(protectedRoute.redirect, { redirectCode: 301 });
    }
  }
});
