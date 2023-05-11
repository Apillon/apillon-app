import packageConfig from '../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app.apillon.io',
  apiUrl: 'https://console-api.apillon.io',
  CHAIN_ID: '0x5',
  captchaKey: 'f5f700a0-51b2-49f3-9ba5-46c7fe146af0',
  githubId: '70d0aa8922fe05268341',
  publishedFeatures: [
    'DISCORD',
    'HOSTING',
    'PROJECT',
    'PROJECT_ON_STARTUP',
    'PROJECT_SETTINGS',
    'REFERRAL',
    'SERVICES',
    'WALLET_LOGIN',
    'STORAGE',
  ],
  betaFeatures: ['NFT'],
};

export default config;
