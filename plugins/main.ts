// import PortalVue from 'portal-vue';
import type { RuntimeConfig } from '@nuxt/schema';

export default defineNuxtPlugin(_ => {
  /**
   * Portals are not currently in use   
  nuxtApp.vueApp.use(PortalVue);
  */

  /** Set API base URL */
  const appConfig: RuntimeConfig = useRuntimeConfig();
  $api.setBaseUrl(appConfig.public.apiUrl);
});
