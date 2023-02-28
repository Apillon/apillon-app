import type { RuntimeConfig } from '@nuxt/schema';
import VuePapaParse from 'vue-papa-parse';

export default defineNuxtPlugin(nuxtApp => {
  /** Set API base URL */
  const appConfig: RuntimeConfig = useRuntimeConfig();
  $api.setBaseUrl(appConfig.public.apiUrl);

  /** CSV parser */
  nuxtApp.vueApp.use(VuePapaParse);
});
