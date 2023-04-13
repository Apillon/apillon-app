import packageConfig from '../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:6001',
  CHAIN_ID: '0x5',
  captchaKey: 'f5f700a0-51b2-49f3-9ba5-46c7fe146af0',
  githubId: 'd0482598d8adbd8adffa',
  publishedFeatures: [
    'APILLON_REGISTER',
    'AUTHENTICATION',
    'BILLING',
    'CONFIGURATION',
    'DISCORD',
    'HOSTING',
    'INSTRUCTIONS',
    'NFT',
    'ONBOARDING',
    'PROJECT',
    'PROJECT_DELETE',
    'PROJECT_ON_STARTUP',
    'PROJECT_SETTINGS',
    'REFERRAL',
    'SERVICES',
    'STORAGE',
    'MONITORING',
    'TWO_FACTOR_AUTHENTICATION',
    'WALLET_LOGIN',
  ],
  betaFeatures: [],
};

export default config;
