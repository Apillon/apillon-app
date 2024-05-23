import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app-dev.apillon.io',
  apiUrl: 'https://console-api-dev.apillon.io',
  oauthUrl: 'https://oauth-dev.apillon.io',
  adminUrl: 'https://admin-dev.apillon.io',
  mailerLiteSubscribeUrl: 'https://landing.mailerlite.com/webforms/landing/i9f9l9',
  captchaKey: 'f5f700a0-51b2-49f3-9ba5-46c7fe146af0',
  githubId: 'd0482598d8adbd8adffa',
  gtmId: 'GTM-P7V3D3P6',
  publishedFeatures: [
    'ACCESS',
    'API_KEYS',
    'AUTHENTICATION',
    'BILLING',
    'CAPTCHA_LOGIN',
    'CONFIGURATION',
    'DISCORD',
    'HOSTING',
    'INSTRUCTIONS',
    'KILT_LOGIN',
    'MARKETING',
    'NFT',
    'NFT_NESTABLE',
    'PREBUILD_SOLUTIONS',
    'PROJECT',
    'PROJECT_DELETE',
    'PROJECT_ON_STARTUP',
    'PROJECT_SETTINGS',
    'PREBUILD_SOLUTIONS',
    'REFERRAL',
    'SERVICES',
    'SOCIAL',
    'SOCIAL_ICONS',
    'STORAGE',
    'TWO_FACTOR_AUTHENTICATION',
    'WALLET_LOGIN',
    'COMPUTING',
  ],
  betaFeatures: [],
};

export default config;
