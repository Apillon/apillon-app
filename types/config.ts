import type { PublicRuntimeConfig } from '@nuxt/schema';

export enum Feature {
  SEARCH = 'SEARCH',
  TWO_FACTOR_AUTHENTICATION = 'TWO_FACTOR_AUTHENTICATION',
}
export default interface ConfigInterface extends PublicRuntimeConfig {
  url: string;
  apiUrl: string;
  CHAIN_ID: string;
  features: Record<Feature, boolean>;
}
