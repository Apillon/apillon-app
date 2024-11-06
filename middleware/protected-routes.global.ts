import { useAuthStore } from '~/composables/stores/auth';
import { Permission } from '~/lib/types/settings';
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
  permission?: number;
}

const protectedRoutes: Array<ProtectedRouteInterface> = [
  { regex: /^\/connect/, redirect: '/login' },
  { regex: /^\/dashboard/, redirect: '/login' },
  { regex: /^\/onboarding/, redirect: '/login' },
  { path: '/profile', redirect: '/login' },
];

const adminRoutes: Array<ProtectedRouteInterface> = [
  { regex: /^\/dashboard\/payments/, redirect: '/dashboard' },
  { regex: /^\/dashboard\/usage/, redirect: '/dashboard' },
  { regex: /^\/dashboard\/billing/, redirect: '/dashboard' },
];
const featureRoutes: Array<FeatureRouteInterface> = [
  { regex: /^\/onboarding/, redirect: '/dashboard', feature: Feature.ONBOARDING },
  { regex: /^\/connect\/discord/, redirect: '/dashboard', feature: Feature.DISCORD },
  { regex: /^\/dashboard\/referral/, redirect: '/dashboard', feature: Feature.REFERRAL },
  { regex: /^\/dashboard\/service/, redirect: '/dashboard', feature: Feature.SERVICES },
  { regex: /^\/dashboard\/solution/, redirect: '/dashboard', feature: Feature.PREBUILD_SOLUTIONS },
  {
    regex: /^\/dashboard\/service\/authentication/,
    redirect: '/dashboard',
    feature: Feature.AUTHENTICATION,
    permission: Permission.AUTHENTICATION,
  },
  {
    regex: /^\/dashboard\/service\/asset-hub/,
    redirect: '/dashboard',
    feature: Feature.ASSET_HUB,
    permission: Permission.EMBEDDED_WALLET,
  },
  {
    regex: /^\/dashboard\/service\/storage/,
    redirect: '/dashboard',
    feature: Feature.STORAGE,
    permission: Permission.STORAGE,
  },
  {
    regex: /^\/dashboard\/service\/hosting/,
    redirect: '/dashboard',
    feature: Feature.HOSTING,
    permission: Permission.HOSTING,
  },
  {
    regex: /^\/dashboard\/service\/nft/,
    redirect: '/dashboard',
    feature: Feature.NFT,
    permission: Permission.NFTS,
  },

  {
    regex: /^\/dashboard\/service\/computing/,
    redirect: '/dashboard',
    feature: Feature.COMPUTING,
    permission: Permission.COMPUTING,
  },
  {
    regex: /^\/dashboard\/service\/cloud-functions/,
    redirect: '/dashboard',
    feature: Feature.CLOUD_FUNCTIONS,
    permission: Permission.COMPUTING,
  },
  {
    regex: /^\/dashboard\/service\/embedded-wallet/,
    redirect: '/dashboard',
    feature: Feature.EMBEDDED_WALLET,
    permission: Permission.EMBEDDED_WALLET,
  },
  {
    regex: /^\/dashboard\/service\/smart-contracts/,
    redirect: '/dashboard',
    feature: Feature.SMART_CONTRACTS,
    permission: Permission.COMPUTING,
  },
  {
    regex: /^\/dashboard\/service\/rpc/,
    redirect: '/dashboard',
    feature: Feature.RPC,
    permission: Permission.RPC,
  },
  { regex: /^\/dashboard\/monitoring/, redirect: '/dashboard', feature: Feature.MONITORING },
  {
    regex: /^\/dashboard\/project-settings/,
    redirect: '/dashboard',
    feature: Feature.PROJECT_SETTINGS,
  },
  { regex: /^\/dashboard\/access/, redirect: '/dashboard', feature: Feature.ACCESS },
  { regex: /^\/dashboard\/api-keys/, redirect: '/dashboard', feature: Feature.API_KEYS },
  { regex: /^\/dashboard\/billing/, redirect: '/dashboard', feature: Feature.BILLING },
  { regex: /^\/dashboard\/usage/, redirect: '/dashboard', feature: Feature.BILLING },
  { regex: /^\/dashboard\/payments/, redirect: '/dashboard', feature: Feature.BILLING },
];

const ignoreRoutes: String[] = ['login-admin'];

/**
 * Redirect user to landing page if not logged in and trying to access protected routes
 */
export default defineNuxtRouteMiddleware((to, from) => {
  /** Ignored routes */
  if (ignoreRoutes.includes(to.name as string)) {
    return;
  }

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
      (!isFeatureEnabled(featureRoute.feature, authStore.getUserRoles()) ||
        (featureRoute.permission && !authStore.isUserAllowed(featureRoute.permission))) &&
      (!authStore.jwt || !!authStore.userUuid)
    ) {
      return navigateTo(featureRoute.redirect, { redirectCode: 301 });
    }
  }

  const dataStore = useDataStore();
  /** Redirect admin routes if user is not admin or owner */
  for (const adminRoute of adminRoutes) {
    if ((!adminRoute.path && !adminRoute.regex) || !adminRoute.redirect) {
      continue;
    }
    if (
      ((adminRoute.regex && adminRoute.regex.test(decodedUrl)) || decodedUrl === adminRoute.path) &&
      dataStore.hasProjects &&
      dataStore.isProjectUser
    ) {
      return navigateTo(adminRoute.redirect, { redirectCode: 301 });
    }
  }
});
