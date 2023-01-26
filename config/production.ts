import packageConfig from '../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app.apillon.io',
  apiUrl: 'https://console-api.apillon.io',
  CHAIN_ID: '0x5',
  captchaKey: 'f5f700a0-51b2-49f3-9ba5-46c7fe146af0',
  githubId: '70d0aa8922fe05268341',
  features: {
    ACCESS: false,
    AUTHENTICATION: false,
    BILLING: false,
    CONFIGURATION: false,
    COMPUTING: false,
    MONITORING: false,
    PROJECT: true,
    PROJECT_ON_STARTUP: false,
    PROJECT_SETTINGS: false,
    REFERRAL: false,
    SEARCH: false,
    SERVICES: true,
    STORAGE: false,
    TWO_FACTOR_AUTHENTICATION: false,
  },
};

export default config;
