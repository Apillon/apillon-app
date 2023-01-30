import packageConfig from '../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:6001',
  CHAIN_ID: '0x5',
  captchaKey: 'f5f700a0-51b2-49f3-9ba5-46c7fe146af0',
  githubId: 'd0482598d8adbd8adffa',
  // features: {
  //   ACCESS: false,
  //   APILLON_REGISTER: true,
  //   AUTHENTICATION: true,
  //   BILLING: true,
  //   CONFIGURATION: true,
  //   COMPUTING: false,
  //   HOSTING: true,
  //   INSTRUCTIONS: true,
  //   MAGIC_LINK: true,
  //   MONITORING: false,
  //   ONBOARDING: true,
  //   PROJECT: true,
  //   PROJECT_ON_STARTUP: true,
  //   PROJECT_SETTINGS: true,
  //   REFERRAL: true,
  //   SEARCH: true,
  //   SERVICES: true,
  //   SOCIAL_ICONS: false,
  //   STORAGE: true,
  //   TWO_FACTOR_AUTHENTICATION: true,
  //   WALLET_LOGIN: true,
  // },
  publishedFeatures: [
    'APILLON_REGISTER',
    'AUTHENTICATION',
    'BILLING',
    'CONFIGURATION',
    'INSTRUCTIONS',
    'MAGIC_LINK',
    'ONBOARDING',
    'PROJECT',
    'PROJECT_ON_STARTUP',
    'PROJECT_SETTINGS',
    'REFERRAL',
    'SEARCH',
    'SERVICES',
    'MONITORING',
    'TWO_FACTOR_AUTHENTICATION',
    'WALLET_LOGIN',
  ],
  betaFeatures: ['STORAGE', 'HOSTING'],
};

export default config;
