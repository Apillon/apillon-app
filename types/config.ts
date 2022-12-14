import type { PublicRuntimeConfig } from '@nuxt/schema';

export enum Feature {
  ACCESS = 'ACCESS',
  APILLON_REGISTER = 'APILLON_REGISTER',
  AUTHENTICATION = 'AUTHENTICATION',
  BILLING = 'BILLING',
  CONFIGURATION = 'CONFIGURATION',
  COMPUTING = 'COMPUTING',
  INSTRUCTIONS = 'INSTRUCTIONS',
  MAGIC_LINK = 'MAGIC_LINK',
  MONITORING = 'MONITORING',
  ONBOARDING = 'ONBOARDING',
  PROJECT = 'PROJECT',
  PROJECT_ON_STARTUP = 'PROJECT_ON_STARTUP',
  PROJECT_SETTINGS = 'PROJECT_SETTINGS',
  REFERRAL = 'REFERRAL',
  SEARCH = 'SEARCH',
  SERVICES = 'SERVICES',
  SOCIAL_ICONS = 'SOCIAL_ICONS',
  STORAGE = 'STORAGE',
  TWO_FACTOR_AUTHENTICATION = 'TWO_FACTOR_AUTHENTICATION',
  WALLET_LOGIN = 'WALLET_LOGIN',
}

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;
interface PropsFeatures {
  features?: Partial<Record<Feature, boolean>>;
}

declare global {
  interface ConfigInterface extends SimpleSpread<PublicRuntimeConfig, PropsFeatures> {
    VERSION: string;
    url: string;
    apiUrl: string;
    CHAIN_ID: string;
  }
}
