import type { RuntimeConfig } from '@nuxt/schema';
import VuePapaParse from 'vue-papa-parse';
import VueCookieAcceptDecline from 'vue-cookie-accept-decline';
import { createGtm } from '@gtm-support/vue-gtm';

export default defineNuxtPlugin(nuxtApp => {
  /** Set API base URL */
  const appConfig: RuntimeConfig = useRuntimeConfig();
  $api.setBaseUrl(appConfig.public.apiUrl);

  /** CSV parser */
  nuxtApp.vueApp.use(VuePapaParse);

  /** Cookie notice */
  nuxtApp.vueApp.component('vue-cookie-accept-decline', VueCookieAcceptDecline);

  /** GTM  */
  try {
    const config = useRuntimeConfig();
    nuxtApp.vueApp.use(
      createGtm({
        id: config.public.gtmId, // Your GTM single container ID, array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy'] or array of objects [{id: 'GTM-xxxxxx', queryParams: { gtm_auth: 'abc123', gtm_preview: 'env-4', gtm_cookies_win: 'x'}}, {id: 'GTM-yyyyyy', queryParams: {gtm_auth: 'abc234', gtm_preview: 'env-5', gtm_cookies_win: 'x'}}], // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy']
        defer: false, // Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible). Defaults to false, so the script is loaded `async` by default
        compatibility: false, // Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`
        nonce: '', // Will add `nonce` to the script tag
        enabled: false, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
        debug: false, // Whether or not display console logs debugs (optional)
        loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
        vueRouter: useRouter(), // Pass the router instance to automatically sync with router (optional)
        ignoredViews: [''], // Don't trigger events for specified router names (optional)
        trackOnNextTick: false, // Whether or not call trackView in Vue.nextTick
      })
    );
  } catch (e) {
    console.log(e);
  }

  /** Preserve query params */
  const router = useRouter();
  router.beforeEach((to, from, next) => {
    if (!hasQueryParams(to) && hasQueryParams(from) && !toStr(to.name).includes('dashboard-')) {
      next({ name: to.name, query: from.query });
    } else {
      next();
    }
  });
});

function hasQueryParams(route: RouteLocationNormalized) {
  return !!Object.keys(route.query).length;
}
