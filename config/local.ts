import ConfigInterface from '~~/types/config';

const config: ConfigInterface = {
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:6001',
  CHAIN_ID: '0x5',
  features: {
    SEARCH: false,
    TWO_FACTOR_AUTHENTICATION: false,
  },
};

export default config;
