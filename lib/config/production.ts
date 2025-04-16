import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app.apillon.io',
  apiUrl: 'https://console-api.apillon.io',
  oauthUrl: 'https://oauth.apillon.io',
  adminUrl: 'https://admin.apillon.io',
  mailerLiteSubscribeUrl: 'https://landing.mailerlite.com/webforms/landing/i9f9l9',
  captchaKey: '5DWvYfCSGqbUiQyvV5idUmbD3xdNHM9jtjGzs5iK4K4A5Rh4',
  githubId: '70d0aa8922fe05268341',
  gtmId: 'GTM-P7V3D3P6',
  deploymentGithubId: '70d0aa8922fe05268341',
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
  betaFeatures: ['ASSET_HUB', 'INDEXING', 'SMART_CONTRACTS', 'CLOUD_FUNCTIONS'],
};

export default config;
