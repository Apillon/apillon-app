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
  NEWSLETTER: 'al_newsletter_subscribed',
  SERVICE_STATUS: 'al_service_status',
};

export const SessionKeys = {
  CREDITS_MSG: 'al_credits_msg',
  SUBSCRIPTION_MSG: 'al_subscription_msg',
  WEBSITE_REVIEW: 'al_website_review',
};

export const LsAnalyticsKeys = {
  USER_UUID: 'al_analytics_user_uuid',
};

export const LsTableColumnsKeys = {
  FILES: 'al_table_files_columns',
  IPNS: 'al_table_ipns_columns',
  NFT_COLLECTION: 'al_table_nft_collection_columns',
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
  HOSTING_NEW: 'al_w3warn_hosting_new',
  HOSTING_DEPLOY: 'al_w3warn_hosting_deploy',
  NFT_NEW: 'al_w3warn_nft_new',
  SOCIAL_NEW: 'al_w3warn_social_new',
};

export const LsCacheKeys = {
  API_KEYS: 'al_cache_api_keys',
  BUCKET: 'al_cache_bucket',
  BUCKETS: 'al_cache_buckets',
  BUCKET_ITEMS: 'al_cache_bucket_items',
  BUCKET_DESTROYED: 'al_cache_bucket_destroyed',
  CHAT: 'al_cache_chat',
  CHATS: 'al_cache_chats',
  COLLECTION: 'al_cache_collection',
  COLLECTIONS: 'al_cache_collections',
  COLLECTION_METADATA: 'al_cache_collection_metadata',
  COLLECTION_TRANSACTIONS: 'al_cache_collection_transactions',
  COMPUTING_TRANSACTIONS: 'al_cache_computing_transactions',
  CONTRACT: 'al_cache_contract',
  CONTRACTS: 'al_cache_contracts',
  CLOUD_FUNCTION: 'al_cache_cloud_function',
  CLOUD_FUNCTIONS: 'al_cache_cloud_functions',
  CREDITS: 'al_cache_credits',
  CREDIT_PACKAGES: 'al_cache_credit_packages',
  CUSTOMER_PORTAL_URL: 'al_cache_customer_portal',
  DEPLOYMENT: 'al_cache_deployment',
  DEPLOYMENTS_PRODUCTION: 'al_cache_deployments_production',
  DEPLOYMENTS_STAGING: 'al_cache_deployments_staging',
  DISCORD_LINK: 'al_cache_discord_link',
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
  PROJECT: 'al_cache_project',
  PROJECTS: 'al_cache_projects',
  PROJECT_OVERVIEW: 'al_cache_project_overview',
  REFERRAL: 'al_cache_referral',
  REFERRAL_AIRDROP: 'al_cache_referral_airdrop',
  SERVICES: 'al_cache_services',
  SERVICE_TYPES: 'al_cache_service_types',
  STORAGE_INFO: 'al_cache_storage_info',
  SUBSCRIPTION_ACTIVE: 'al_cache_subscription_active',
  SUBSCRIPTION_PACKAGES: 'al_cache_subscription_packages',
  WEBSITE: 'al_cache_website',
  WEBSITES: 'al_cache_websites',
  EW_API_KEYS: 'al_ew_cache_api_keys',
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
