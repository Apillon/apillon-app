import ConfigInterface from '~~/types/config';

const config: ConfigInterface = {
  url: 'https://app.apillon.io',
  apiUrl: 'https://api.apillon.io',
  CHAIN_ID: '0x5',
  features: {
    ACCESS: false,
    AUTHENTICATION: false,
    BILLING: false,
    CONFIGURATION: true,
    COMPUTING: false,
    MONITORING: false,
    PROJECT_SETTINGS: false,
    SEARCH: false,
    SERVICES: true,
    STORAGE: false,
    TWO_FACTOR_AUTHENTICATION: false,
  },
};

export default config;
