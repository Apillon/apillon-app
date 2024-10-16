import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:6001',
  oauthUrl: 'http://localhost:5173',
  adminUrl: 'http://localhost:3001',
  mailerLiteSubscribeUrl: '',
  captchaKey: '10000000-ffff-ffff-ffff-000000000001',
  githubId: 'd0482598d8adbd8adffa',
  gtmId: '',
  nctrContract: '0xddf5F225218fd09Ffa39712aFd9a4Bc34b21b473',
  publishedFeatures: [
    'ACCESS',
    'API_KEYS',
    'AUTHENTICATION',
    'BILLING',
    'CONFIGURATION',
    'COMPUTING',
    'CLOUD_FUNCTIONS',
    'DISCORD',
    'HOSTING',
    'INDEXING',
    'INSTRUCTIONS',
    'MARKETING',
    'NFT',
    'NFT_NESTABLE',
    'NFT_POAP',
    'ONBOARDING',
    'PREBUILD_SOLUTIONS',
    'PROJECT',
    'PROJECT_DELETE',
    'PROJECT_ON_STARTUP',
    'PROJECT_SETTINGS',
    'REFERRAL',
    'SERVICES',
    'SOCIAL',
    'SOCIAL_ICONS',
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
