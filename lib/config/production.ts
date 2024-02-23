import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app.apillon.io',
  apiUrl: 'https://console-api.apillon.io',
  oauthUrl: 'https://oauth.apillon.io',
  adminUrl: 'https://admin.apillon.io',
  mailerLiteSubscribeUrl: 'https://landing.mailerlite.com/webforms/landing/i9f9l9',
  captchaKey: 'f5f700a0-51b2-49f3-9ba5-46c7fe146af0',
  githubId: '70d0aa8922fe05268341',
  gtmId: 'GTM-P7V3D3P6',
  publishedFeatures: [
    'ACCESS',
    'DISCORD',
    'HOSTING',
    'PROJECT',
    'PROJECT_ON_STARTUP',
    'PROJECT_SETTINGS',
    'SERVICES',
    'WALLET_LOGIN',
    'CAPTCHA_LOGIN',
    'REFERRAL',
    'STORAGE',
    'NFT',
    'KILT_LOGIN',
    'BILLING',
    'AUTHENTICATION',
    'MARKETING',
  ],
  betaFeatures: ['NFT_NESTABLE', 'COMPUTING', 'SOCIAL'],
};

export default config;
