import type { SelectOption } from 'naive-ui';
import { DefaultUserRole } from '../types/project';

export const MINUTE_IN_MS = 60 * 1000; // 1 minute
export const CACHE_EXPIRATION_IN_MS = 10 * 60 * 1000; // 10 minutes
export const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000; // 1 week in MS
export const ON_COLUMN_CLICK_OPEN_CLASS = 'onClickOpen';
export const NFT_MAX_SUPPLY = 10000;
export const PAGINATION_LIMIT = 20;
export const PARAMS_ALL_ITEMS = {
  page: 1,
  limit: 1000,
};

export enum PageSize {
  SM = 10,
  BASE = PAGINATION_LIMIT,
  LG = 50,
}

export const LS_KEYS = {
  APP_VERSION: 'al_app_version',
  DEPLOYMENT_REFRESH_INTERVAL: 'al_deployment_refresh_interval',
  NEWSLETTER: 'al_newsletter_subscribed',
  SERVICE_STATUS: 'al_service_status',
};

export const SessionKeys = {
  ASSET_HUB: 'al_asset_hub',
  CREDITS_MSG: 'al_credits_msg',
  SUBSCRIPTION_MSG: 'al_subscription_msg',
  WEBSITE_REVIEW: 'al_website_review',
};

export const LsAnalyticsKeys = {
  USER_UUID: 'al_analytics_user_uuid',
};

export const LsTableColumnsKeys = {
  ASSET_HUB: 'al_table_asset_hub',
  FILES: 'al_table_files_columns',
  IPNS: 'al_table_ipns_columns',
  NFT_COLLECTION: 'al_table_nft_collection_columns',
  SMART_CONTRACTS: 'al_table_smart_contracts',
  SOCIAL_POST: 'al_table_social_channel',
};

export const LsW3WarnKeys = {
  AUTH_NEW: 'al_w3warn_auth_new',
  BUCKET_NEW: 'al_w3warn_bucket_new',
  BUCKET_DELETE: 'al_w3warn_bucket_delete',
  BUCKET_DESTROYED: 'al_w3warn_bucket_destroyed',
  BUCKET_ITEM_DELETE: 'al_w3warn_bucket_item_delete',
  CONTRACT_NEW: 'al_w3warn_contract_new',
  CLOUD_FUNCTION_NEW: 'al_w3warn_cloud_function_new',
  COLLECTION_DELETE: 'al_w3warn_collection_delete',
  HOSTING_NEW: 'al_w3warn_hosting_new',
  HOSTING_DEPLOY: 'al_w3warn_hosting_deploy',
  HOSTING_DELETE: 'al_w3warn_hosting_delete',
  NFT_NEW: 'al_w3warn_nft_new',
  SOCIAL_NEW: 'al_w3warn_social_new',
};

export const LsCacheKeys = {
  API_KEYS: 'al_cache_api_keys',
  ASSET: 'al_cache_asset',
  ASSETS: 'al_cache_assets',
  ASSETS_TESTNET: 'al_cache_assets_testnet',
  BUCKET: 'al_cache_bucket',
  BUCKETS: 'al_cache_buckets',
  BUCKET_ITEMS: 'al_cache_bucket_items',
  BUCKET_DESTROYED: 'al_cache_bucket_destroyed',
  CHAT: 'al_cache_chat',
  CHATS: 'al_cache_chats',
  CHAT_ARCHIVE: 'al_cache_chat_archive',
  COLLECTION: 'al_cache_collection',
  COLLECTIONS: 'al_cache_collections',
  COLLECTION_ARCHIVE: 'al_cache_collection_archive',
  COLLECTION_METADATA: 'al_cache_collection_metadata',
  COLLECTION_TRANSACTIONS: 'al_cache_collection_transactions',
  COMPUTING_TRANSACTIONS: 'al_cache_computing_transactions',
  CONTRACT: 'al_cache_contract',
  CONTRACTS: 'al_cache_contracts',
  CONTRACT_ARCHIVE: 'al_cache_contract_archive',
  CLOUD_FUNCTION: 'al_cache_cloud_function',
  CLOUD_FUNCTIONS: 'al_cache_cloud_functions',
  CLOUD_FUNCTIONS_ARCHIVE: 'al_cache_cloud_functions_archive',
  CLOUD_FUNCTION_USAGE: 'al_cache_cloud_function_usage',
  CLOUD_FUNCTION_VARIABLES: 'al_cache_cloud_function_variables',
  CREDITS: 'al_cache_credits',
  CREDIT_PACKAGES: 'al_cache_credit_packages',
  CUSTOMER_PORTAL_URL: 'al_cache_customer_portal',
  DEPLOYMENT: 'al_cache_deployment',
  DEPLOYMENTS_PRODUCTION: 'al_cache_deployments_production',
  DEPLOYMENTS_STAGING: 'al_cache_deployments_staging',
  DISCORD_LINK: 'al_cache_discord_link',
  EMBEDDED_WALLET: 'al_cache_embedded_wallet',
  EMBEDDED_WALLETS: 'al_cache_embedded_wallets',
  EMBEDDED_WALLET_INFO: 'al_cache_embedded_wallet_info',
  EMBEDDED_WALLET_SIGNATURES: 'al_cache_embedded_wallet_signatures',
  FILE_ALL: 'al_cache_file_all',
  FILE_DELETED: 'al_cache_file_deleted',
  INVOICES: 'al_cache_invoices',
  IPFS: 'al_cache_ipfs',
  IPNS: 'al_cache_ipns',
  IPNS_ITEM: 'al_cache_ipns_item',
  JOB: 'al_cache_job',
  JOBS: 'al_cache_jobs',
  OAUTH_LINKS: 'al_cache_oauth_links',
  PRICE_LIST: 'al_cache_price_list',
  POST: 'al_cache_post',
  POSTS: 'al_cache_posts',
  POST_ARCHIVE: 'al_cache_post_archive',
  PROJECT: 'al_cache_project',
  PROJECTS: 'al_cache_projects',
  PROJECT_OVERVIEW: 'al_cache_project_overview',
  REFERRAL: 'al_cache_referral',
  REFERRAL_AIRDROP: 'al_cache_referral_airdrop',
  RPC_ACTIVATED: 'al_cache_rpc_activated',
  RPC_API_KEYS: 'al_cache_rpc_api_keys',
  RPC_API_KEY: 'al_cache_rpc_api_key',
  RPC_API_KEY_USAGE: 'al_cache_rpc_api_key_usage',
  RPC_API_KEY_USAGE_PER_CHAIN: 'al_cache_rpc_api_key_usage_per_chain',
  RPC_ENDPOINTS: 'al_cache_rpc_endpoints',
  RPC_FAVORITE_ENDPOINTS: 'al_cache_rpc_favorite_endpoints',
  RPC_DWELLIR_ID: 'al_cache_rpc_dwellir_id',
  RPC_PLAN: 'al_cache_rpc_plan',
  RPC_PUBLIC_ENDPOINTS: 'al_cache_rpc_public_endpoints',
  SERVICES: 'al_cache_services',
  SERVICE_TYPES: 'al_cache_service_types',
  STORAGE_INFO: 'al_cache_storage_info',
  SUBSCRIPTION_ACTIVE: 'al_cache_subscription_active',
  SUBSCRIPTION_PACKAGES: 'al_cache_subscription_packages',
  WEBSITE: 'al_cache_website',
  WEBSITES: 'al_cache_websites',
  WEBSITE_ARCHIVE: 'al_cache_website_archive',
  SMART_CONTRACT: 'al_cache_smart_contract',
  SMART_CONTRACTS: 'al_cache_smart_contracts',
  SMART_CONTRACT_DEPLOYED: 'al_smart_contract_deployed',
  SMART_CONTRACTS_DEPLOYED: 'al_smart_contracts_deployed',
  INDEXERS: 'al_cache_indexers',
  INDEXER: 'al_cache_indexer',
  INDEXER_LOGS: 'al_cache_indexer_logs',
  INDEXER_DEPLOYMENTS: 'al_cache_indexer_deployments',
};

/** User roles */
export const UserRoleIds = [
  DefaultUserRole.ADMIN,
  DefaultUserRole.SUPPORT,
  DefaultUserRole.ANALYTIC,
  DefaultUserRole.PROJECT_OWNER,
  DefaultUserRole.PROJECT_ADMIN,
  DefaultUserRole.PROJECT_USER,
  DefaultUserRole.INTERNAL_TEST_USER,
  DefaultUserRole.EXTERNAL_TEST_USER,
  DefaultUserRole.BETA_USER,
  DefaultUserRole.USER,
];

/** User roles */
export function CreateUserRoles(): Array<SelectOption> {
  return Object.entries(DefaultUserRoles).map(([roleId, role]) => {
    return {
      label: window.$i18n.t(`profile.userRole.${role}`),
      value: parseInt(roleId),
      disabled: parseInt(roleId) === DefaultUserRole.PROJECT_OWNER,
    };
  });
}

/**
 * Referral
 */
export const referralCountries = [
  { label: 'Austria', value: 'Austria' },
  { label: 'Belgium', value: 'Belgium' },
  { label: 'Bulgaria', value: 'Bulgaria' },
  { label: 'Croatia', value: 'Croatia' },
  { label: 'Cyprus', value: 'Cyprus' },
  { label: 'Czech Republic', value: 'Czech Republic' },
  { label: 'Denmark', value: 'Denmark' },
  { label: 'Estonia', value: 'Estonia' },
  { label: 'Finland', value: 'Finland' },
  { label: 'France', value: 'France' },
  { label: 'Germany', value: 'Germany' },
  { label: 'Greece', value: 'Greece' },
  { label: 'Hungary', value: 'Hungary' },
  { label: 'Ireland', value: 'Ireland' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Latvia', value: 'Latvia' },
  { label: 'Lithuania', value: 'Lithuania' },
  { label: 'Luxembourg', value: 'Luxembourg' },
  { label: 'Malta', value: 'Malta' },
  { label: 'Netherlands', value: 'Netherlands' },
  { label: 'Poland', value: 'Poland' },
  { label: 'Portugal', value: 'Portugal' },
  { label: 'Romania', value: 'Romania' },
  { label: 'Slovakia', value: 'Slovakia' },
  { label: 'Slovenia', value: 'Slovenia' },
  { label: 'Spain', value: 'Spain' },
  { label: 'Sweden', value: 'Sweden' },
  { label: 'United Kingdom', value: 'United Kingdom' },
];
