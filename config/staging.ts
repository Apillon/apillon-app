const config: ConfigInterface = {
  VERSION: `${require('../package.json').version}`,
  url: 'https://app-staging.apillon.io',
  apiUrl: 'https://console-api-staging.apillon.io',
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
