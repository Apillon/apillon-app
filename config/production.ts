import packageConfig from '../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app.apillon.io',
  apiUrl: 'https://console-api.apillon.io',
  CHAIN_ID: '0x5',
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
