import packageConfig from '../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app-dev.apillon.io',
  apiUrl: 'https://console-api-dev.apillon.io',
  CHAIN_ID: '0x5',
  captchaKey: 'f5f700a0-51b2-49f3-9ba5-46c7fe146af0',
  githubId: 'd0482598d8adbd8adffa',
  features: {
    ACCESS: true,
    APILLON_REGISTER: true,
    AUTHENTICATION: true,
    BILLING: true,
    CONFIGURATION: true,
    COMPUTING: true,
    INSTRUCTIONS: true,
    MAGIC_LINK: true,
    MONITORING: true,
    ONBOARDING: true,
    PROJECT: true,
    PROJECT_ON_STARTUP: true,
    PROJECT_SETTINGS: true,
    REFERRAL: true,
    SEARCH: true,
    SERVICES: true,
    SOCIAL_ICONS: true,
    STORAGE: true,
    TWO_FACTOR_AUTHENTICATION: true,
    WALLET_LOGIN: true,
  },
};

export default config;
