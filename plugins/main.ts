import type { RuntimeConfig } from '@nuxt/schema';

export default defineNuxtPlugin(_ => {
  /** Set API base URL */
  const appConfig: RuntimeConfig = useRuntimeConfig();
  $api.setBaseUrl(appConfig.public.apiUrl);
});
