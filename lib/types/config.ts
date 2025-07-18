import type { PublicRuntimeConfig } from '@nuxt/schema';

export enum Feature {
  ACCESS = 'ACCESS',
  API_KEYS = 'API_KEYS',
  ASSET_HUB = 'ASSET_HUB',
  AUTHENTICATION = 'AUTHENTICATION',
  BILLING = 'BILLING',
  CONFIGURATION = 'CONFIGURATION',
  COMPUTING = 'COMPUTING',
  CLOUD_FUNCTIONS = 'CLOUD_FUNCTIONS',
  DISCORD = 'DISCORD',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC4337 = 'ERC4337',
  HOSTING = 'HOSTING',
  INSTRUCTIONS = 'INSTRUCTIONS',
  MAGIC_LINK = 'MAGIC_LINK',
  MARKETING = 'MARKETING',
  MONITORING = 'MONITORING',
  NFT = 'NFT',
  ONBOARDING = 'ONBOARDING',
  PREBUILD_SOLUTIONS = 'PREBUILD_SOLUTIONS',
  PROJECT = 'PROJECT',
  PROJECT_DELETE = 'PROJECT_DELETE',
  PROJECT_ON_STARTUP = 'PROJECT_ON_STARTUP',
  PROJECT_SETTINGS = 'PROJECT_SETTINGS',
  REFERRAL = 'REFERRAL',
  RMRK = 'RMRK',
  RPC = 'RPC',
  SEARCH = 'SEARCH',
  SERVICES = 'SERVICES',
  SMART_CONTRACTS = 'SMART_CONTRACTS',
  STORAGE = 'STORAGE',
  TWO_FACTOR_AUTHENTICATION = 'TWO_FACTOR_AUTHENTICATION',
  WALLET_LOGIN = 'WALLET_LOGIN',
  KILT_LOGIN = 'KILT_LOGIN',
  CAPTCHA_LOGIN = 'CAPTCHA_LOGIN',
  EMBEDDED_WALLET = 'EMBEDDED_WALLET',
  INDEXING = 'INDEXING',
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
    mailerLiteSubscribeUrl: string;
    captchaKey: string;
    githubId: string;
    deploymentGithubId: string;
    gtmId: string;
  }
}
