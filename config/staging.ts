import packageConfig from '../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app-staging.apillon.io',
  apiUrl: 'https://console-api-staging.apillon.io',
  CHAIN_ID: '0x5',
  captchaKey: 'f5f700a0-51b2-49f3-9ba5-46c7fe146af0',
  githubId: '95223986c9689e1c7657',
  publishedFeatures: ['PROJECT', 'REFERRAL', 'SERVICES', 'STORAGE'],
  betaFeatures: ['HOSTING'],
};

export default config;
