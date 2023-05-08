export const CACHE_EXPIRATION_IN_MS = 10 * 60 * 1000; // 10 minutes
export const ON_COLUMN_CLICK_OPEN_CLASS = 'onClickOpen';
export const NFT_MAX_SUPPLY = 10000;
export const PAGINATION_LIMIT = 20;
export const PARAMS_ALL_ITEMS = {
  page: 1,
  limit: 1000,
};

export const LsTableColumnsKeys = {
  FILES: 'al_table_files_columns',
};

export const LsW3WarnKeys = {
  AUTH_NEW: 'al_w3warn_auth_new',
  BUCKET_NEW: 'al_w3warn_bucket_new',
  BUCKET_DELETE: 'al_w3warn_bucket_delete',
  BUCKET_DESTROYED: 'al_w3warn_bucket_destroyed',
  BUCKET_ITEM_DELETE: 'al_w3warn_bucket_item_delete',
  HOSTING_NEW: 'al_w3warn_hosting_new',
  NFT_NEW: 'al_w3warn_nft_new',
};

export const LsCacheKeys = {
  API_KEYS: 'al_cache_api_keys',
  BUCKET: 'al_cache_bucket',
  BUCKETS: 'al_cache_buckets',
  BUCKET_ITEMS: 'al_cache_bucket_items',
  BUCKET_DESTROYED: 'al_cache_bucket_destroyed',
  COLLECTION: 'al_cache_collection',
  COLLECTIONS: 'al_cache_collections',
  COLLECTION_TRANSACTIONS: 'al_cache_collection_transactions',
  DEPLOYMENT: 'al_cache_deployment',
  DEPLOYMENTS_PRODUCTION: 'al_cache_deployments_production',
  DEPLOYMENTS_STAGING: 'al_cache_deployments_staging',
  DISCORD_LINK: 'al_cache_discord_link',
  FILE_ALL: 'al_cache_file_all',
  FILE_DELETED: 'al_cache_file_deleted',
  IPNS: 'al_cache_ipns',
  IPNS_ITEM: 'al_cache_ipns_item',
  OAUTH_LINKS: 'al_cache_oauth_links',
  PROJECT: 'al_cache_project',
  PROJECTS: 'al_cache_projects',
  REFERRAL: 'al_cache_referral',
  SERVICES: 'al_cache_services',
  SERVICE_AUTH: 'al_cache_service_auth',
  SERVICE_COMPUTING: 'al_cache_service_computing',
  SERVICE_STORAGE: 'al_cache_service_storage',
  WEBSITE: 'al_cache_website',
  WEBSITES: 'al_cache_websites',
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
export function CreateUserRoles(): Array<NSelectOption> {
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
