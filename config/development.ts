import packageConfig from '../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app-dev.apillon.io',
  apiUrl: 'https://console-api-dev.apillon.io',
  CHAIN_ID: '0x5',
  captchaKey: 'f5f700a0-51b2-49f3-9ba5-46c7fe146af0',
  githubId: 'd0482598d8adbd8adffa',
  publishedFeatures: [
    'APILLON_REGISTER',
    'AUTHENTICATION',
    'CONFIGURATION',
    'HOSTING',
    'INSTRUCTIONS',
    'MAGIC_LINK',
    'NFT',
    'ONBOARDING',
    'PROJECT',
    'PROJECT_DELETE',
    'PROJECT_ON_STARTUP',
    'PROJECT_SETTINGS',
    'REFERRAL',
    'SERVICES',
    'SOCIAL_ICONS',
    'STORAGE',
    'TWO_FACTOR_AUTHENTICATION',
    'WALLET_LOGIN',
  ],
  betaFeatures: ['BILLING'],
};

export default config;
