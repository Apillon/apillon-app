import { useAuthStore } from '~/stores/auth';
interface ProtectedRouteInterface {
  path?: string;
  regex?: RegExp;
  redirect: string;
}
interface FeatureRouteInterface {
  path?: string;
  regex?: RegExp;
  redirect: string;
  feature: string;
}

const protectedRoutes: Array<ProtectedRouteInterface> = [
  { regex: /^\/dashboard/, redirect: '/login' },
  { regex: /^\/onboarding/, redirect: '/login' },
  { path: '/profile', redirect: '/login' },
];
const featureRoutes: Array<FeatureRouteInterface> = [
  { regex: /^\/onboarding/, redirect: '/dashboard', feature: Feature.ONBOARDING },
  { regex: /^\/dashboard\/referral/, redirect: '/dashboard', feature: Feature.REFERRAL },
  { regex: /^\/dashboard\/service/, redirect: '/dashboard', feature: Feature.SERVICES },
  {
    regex: /^\/dashboard\/service\/authentication/,
    redirect: '/dashboard',
    feature: Feature.AUTHENTICATION,
  },
  { regex: /^\/dashboard\/service\/storage/, redirect: '/dashboard', feature: Feature.STORAGE },
  { regex: /^\/dashboard\/service\/hosting/, redirect: '/dashboard', feature: Feature.HOSTING },
  { regex: /^\/dashboard\/service\/nft/, redirect: '/dashboard', feature: Feature.NFT },
  { regex: /^\/dashboard\/service\/computing/, redirect: '/dashboard', feature: Feature.COMPUTING },
  { regex: /^\/dashboard\/monitoring/, redirect: '/dashboard', feature: Feature.MONITORING },
  {
    regex: /^\/dashboard\/project-settings/,
    redirect: '/dashboard',
    feature: Feature.PROJECT_SETTINGS,
  },
  { regex: /^\/dashboard\/access/, redirect: '/dashboard', feature: Feature.ACCESS },
  { regex: /^\/dashboard\/billing/, redirect: '/dashboard', feature: Feature.BILLING },
];

/**
 * Redirect user to landing page if not logged in and trying to access protected routes
 */
export default defineNuxtRouteMiddleware(to => {
  const decodedUrl = removeLastSlash(decodeURI(to.path));
  const authStore = useAuthStore();

  /** Redirect protected routes */
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

  /** Redirect feature routes */
  for (const featureRoute of featureRoutes) {
    if ((!featureRoute.path && !featureRoute.regex) || !featureRoute.redirect) {
      continue;
    }
    if (
      ((featureRoute.regex && featureRoute.regex.test(decodedUrl)) ||
        decodedUrl === featureRoute.path) &&
      !isFeatureEnabled(featureRoute.feature, authStore.getUserRoles())
    ) {
      return navigateTo(featureRoute.redirect, { redirectCode: 301 });
    }
  }
});
