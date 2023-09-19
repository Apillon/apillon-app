import type { PublicRuntimeConfig } from '@nuxt/schema';

export enum Feature {
  ACCESS = 'ACCESS',
  APILLON_REGISTER = 'APILLON_REGISTER',
  AUTHENTICATION = 'AUTHENTICATION',
  BILLING = 'BILLING',
  CONFIGURATION = 'CONFIGURATION',
  COMPUTING = 'COMPUTING',
  DISCORD = 'DISCORD',
  HOSTING = 'HOSTING',
  INSTRUCTIONS = 'INSTRUCTIONS',
  MAGIC_LINK = 'MAGIC_LINK',
  MARKETING = 'MARKETING',
  MONITORING = 'MONITORING',
  NFT = 'NFT',
  NFT_NESTABLE = 'NFT_NESTABLE',
  ONBOARDING = 'ONBOARDING',
  PROJECT = 'PROJECT',
  PROJECT_DELETE = 'PROJECT_DELETE',
  PROJECT_ON_STARTUP = 'PROJECT_ON_STARTUP',
  PROJECT_SETTINGS = 'PROJECT_SETTINGS',
  REFERRAL = 'REFERRAL',
  SEARCH = 'SEARCH',
  SERVICES = 'SERVICES',
  SOCIAL_ICONS = 'SOCIAL_ICONS',
  STORAGE = 'STORAGE',
  TWO_FACTOR_AUTHENTICATION = 'TWO_FACTOR_AUTHENTICATION',
  WALLET_LOGIN = 'WALLET_LOGIN',
  KILT_LOGIN = 'KILT_LOGIN',
  CAPTCHA_LOGIN = 'CAPTCHA_LOGIN',
}
export enum AppEnv {
  PROD = 'production',
  STAGING = 'staging',
  DEV = 'development',
  LOCAL = 'local',
}

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;
interface PropsFeatures {
  features?: Partial<Record<Feature, boolean>>;
}

declare global {
  interface ConfigInterface extends SimpleSpread<PublicRuntimeConfig, PropsFeatures> {
    ENV?: string;
    VERSION: string;
    url: string;
    apiUrl: string;
    oauthUrl: string;
    adminUrl: string;
    CHAIN_ID: string;
    captchaKey: string;
    githubId: string;
  }
}
