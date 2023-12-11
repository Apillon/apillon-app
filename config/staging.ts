import packageConfig from '../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app-staging.apillon.io',
  apiUrl: 'https://console-api-staging.apillon.io',
  oauthUrl: 'https://oauth-staging.apillon.io',
  adminUrl: 'https://admin-staging.apillon.io',
  mailerLiteSubscribeUrl: '',
  captchaKey: 'f5f700a0-51b2-49f3-9ba5-46c7fe146af0',
  githubId: '95223986c9689e1c7657',
  gtmId: 'GTM-P7V3D3P6',
  publishedFeatures: [
    'ACCESS',
    'DISCORD',
    'HOSTING',
    'PROJECT',
    'PROJECT_ON_STARTUP',
    'PROJECT_SETTINGS',
    'REFERRAL',
    'SERVICES',
    'WALLET_LOGIN',
    'CAPTCHA_LOGIN',
    'STORAGE',
    'NFT',
    'KILT_LOGIN',
    'BILLING',
    'AUTHENTICATION',
    'MARKETING',
  ],
  betaFeatures: ['NFT_NESTABLE'],
};

export default config;
