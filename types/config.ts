import type { PublicRuntimeConfig } from '@nuxt/schema';
export default interface ConfigInterface extends PublicRuntimeConfig {
  url: string;
  apiUrl: string;
  CHAIN_ID: string;
}
