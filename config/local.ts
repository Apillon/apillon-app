import ConfigInterface from '~~/types/config';

const config: ConfigInterface = {
  VERSION: `${require('../package.json').version}`,
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:6001',
  CHAIN_ID: '0x5',
  features: {
    ACCESS: true,
    AUTHENTICATION: true,
    BILLING: false,
    CONFIGURATION: true,
    COMPUTING: false,
    INSTRUCTIONS: true,
    MONITORING: false,
    PROJECT_SETTINGS: true,
    SEARCH: false,
    SERVICES: true,
    STORAGE: true,
    TWO_FACTOR_AUTHENTICATION: false,
  },
};

export default config;
