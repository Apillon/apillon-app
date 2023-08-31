import packageConfig from '../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:6001',
  oauthUrl: 'http://localhost:5173',
  adminUrl: 'http://localhost:3001',
  CHAIN_ID: '0x5',
  captchaKey: '10000000-ffff-ffff-ffff-000000000001',
  githubId: 'd0482598d8adbd8adffa',
  publishedFeatures: [
    'APILLON_REGISTER',
    'AUTHENTICATION',
    'BILLING',
    'CONFIGURATION',
    'DISCORD',
    'HOSTING',
    'INSTRUCTIONS',
    'MARKETING',
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
    'KILT_LOGIN',
    'CAPTCHA_LOGIN',
  ],
  betaFeatures: [],
};

export default config;
