const config: ConfigInterface = {
  VERSION: `${require('../package.json').version}`,
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:6001',
  CHAIN_ID: '0x5',
  features: {
    ACCESS: true,
    APILLON_REGISTER: true,
    AUTHENTICATION: true,
    BILLING: true,
    CONFIGURATION: true,
    COMPUTING: true,
    INSTRUCTIONS: true,
    MAGIC_LINK: true,
    MONITORING: true,
    ONBOARDING: false,
    PROJECT: true,
    PROJECT_ON_STARTUP: true,
    PROJECT_SETTINGS: true,
    REFERRAL: true,
    SEARCH: true,
    SERVICES: true,
    STORAGE: true,
    TWO_FACTOR_AUTHENTICATION: true,
    WALLET_LOGIN: true,
  },
};

export default config;
