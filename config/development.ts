import ConfigInterface from '~~/types/config';

const config: ConfigInterface = {
  url: 'https://app-dev.apillon.io',
  apiUrl: 'https://api-dev.apillon.io',
  CHAIN_ID: '0x5',
  features: {
    ACCESS: true,
    APILLON_REGISTER: true,
    AUTHENTICATION: true,
    BILLING: true,
    CONFIGURATION: true,
    COMPUTING: true,
    MAGIC_LINK: true,
    MONITORING: true,
    PROJECT_SETTINGS: true,
    SEARCH: true,
    SERVICES: true,
    STORAGE: true,
    TWO_FACTOR_AUTHENTICATION: true,
    WALLET_LOGIN: true,
  },
};

export default config;
