import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app-staging.apillon.io',
  apiUrl: 'https://console-api-staging.apillon.io',
  oauthUrl: 'https://oauth-staging.apillon.io',
  adminUrl: 'https://admin-staging.apillon.io',
  mailerLiteSubscribeUrl: 'https://landing.mailerlite.com/webforms/landing/i9f9l9',
  captchaKey: 'f5f700a0-51b2-49f3-9ba5-46c7fe146af0',
  githubId: '95223986c9689e1c7657',
  gtmId: 'GTM-P7V3D3P6',
  nctrContract: '0xc27e62A737C7474AD9EEF6C493Ed68c71dB80A65',
  publishedFeatures: [
    'ACCESS',
    'API_KEYS',
    'ASSET_HUB',
    'AUTHENTICATION',
    'BILLING',
    'CAPTCHA_LOGIN',
    'CLOUD_FUNCTIONS',
    'COMPUTING',
    'DISCORD',
    'EMBEDDED_WALLET',
    'HOSTING',
    'INDEXING',
    'KILT_LOGIN',
    'MARKETING',
    'NFT',
    'NFT_NESTABLE',
    'PREBUILD_SOLUTIONS',
    'PROJECT',
    'PROJECT_ON_STARTUP',
    'PROJECT_SETTINGS',
    'REFERRAL',
    'RPC',
    'SERVICES',
    'SMART_CONTRACTS',
    'SOCIAL',
    'STORAGE',
    'WALLET_LOGIN',
  ],
  betaFeatures: ['ASSET_HUB', 'EMBEDDED_WALLET', 'INDEXING', 'RPC', 'SMART_CONTRACTS'],
};

export default config;
