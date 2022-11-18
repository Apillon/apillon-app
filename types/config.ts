import type { PublicRuntimeConfig } from '@nuxt/schema';

export enum Feature {
  ACCESS = 'ACCESS',
  APILLON_REGISTER = 'APILLON_REGISTER',
  AUTHENTICATION = 'AUTHENTICATION',
  BILLING = 'BILLING',
  CONFIGURATION = 'CONFIGURATION',
  COMPUTING = 'COMPUTING',
  MAGIC_LINK = 'MAGIC_LINK',
  MONITORING = 'MONITORING',
  PROJECT_SETTINGS = 'PROJECT_SETTINGS',
  SEARCH = 'SEARCH',
  SERVICES = 'SERVICES',
  STORAGE = 'STORAGE',
  TWO_FACTOR_AUTHENTICATION = 'TWO_FACTOR_AUTHENTICATION',
  WALLET_LOGIN = 'WALLET_LOGIN',
}
export default interface ConfigInterface extends PublicRuntimeConfig {
  url: string;
  apiUrl: string;
  CHAIN_ID: string;
  features?: Partial<Record<Feature, boolean>>;
}
