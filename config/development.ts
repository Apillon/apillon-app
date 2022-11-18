import ConfigInterface from '~~/types/config';

const config: ConfigInterface = {
  url: 'https://app-dev.apillon.io',
  apiUrl: 'https://api-dev.apillon.io',
  CHAIN_ID: '0x5',
  features: {
    SEARCH: false,
    TWO_FACTOR_AUTHENTICATION: false,
  },
};

export default config;
