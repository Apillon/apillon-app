<template>
  <Menu
    :key="menuKey"
    :slice-name="true"
    :inverted="true"
    :root-indent="32"
    :indent="0"
    :icon-size="20"
    :collapsed="collapsed"
    :collapsed-width="40"
    :collapsed-icon-size="24"
    :default-expanded-keys="defaultExpandedKeys"
    :options="menuOptions"
    @update:value="$emit('toggleSidebar')"
  />
</template>

<script lang="ts" setup>
import type { MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import { Feature } from '~/lib/types/config';
import { isBetaFeature } from '~/lib/utils';

const props = defineProps({
  collapsed: { type: Boolean, default: false },
});
defineEmits(['toggleSidebar']);

const { t } = useI18n();
const authStore = useAuthStore();
const dataStore = useDataStore();

const menuKey = computed<string>(() => `menu-${dataStore.project.items.length}`);
const zeroProjects = computed(() => dataStore.hasProjects === false);

const defaultExpandedKeys = computed(() => [
  'coreWeb3Infrastructure',
  'assetManagement',
  'utility',
]);

const menuOptions = computed<MenuMixedOption[]>(() => {
  const dashboard = {
    key: 'dashboard',
    label: t('dashboard.nav.projectOverview'),
    to: 'dashboard',
    iconName: 'icon-home',
    disabled: isMenuItemDisabled(Feature.PROJECT),
  };
  const services = [
    {
      key: 'dashboard-service',
      label: t('dashboard.nav.services'),
      to: 'dashboard-service',
      color: 'yellow',
      svgIcon: 'menu/home-gear',
      // show: !props.collapsed,
    },
    {
      key: 'dashboard-simplets',
      label: t('dashboard.nav.simplets'),
      to: 'dashboard-solution',
      color: 'blue',
      svgIcon: 'menu/tools',
      // show: !props.collapsed,
    },
  ];

  const coreWeb3Infrastructure = [
    {
      key: 'dashboard-service-storage',
      label: t('dashboard.nav.storage'),
      to: 'dashboard-service-storage',
      iconName: 'icon-storage',
      soon: isMenuItemDisabled(Feature.STORAGE),
      disabled:
        isMenuItemDisabled(Feature.STORAGE) ||
        !authStore.isUserAllowed(Permission.STORAGE) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-hosting',
      label: t('dashboard.nav.hosting'),
      to: 'dashboard-service-hosting',
      iconName: 'icon-hosting',
      soon: isMenuItemDisabled(Feature.HOSTING),
      disabled:
        isMenuItemDisabled(Feature.HOSTING) ||
        !authStore.isUserAllowed(Permission.HOSTING) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-embedded-wallet',
      label: t('dashboard.nav.embeddedWallet'),
      to: 'dashboard-service-embedded-wallet',
      iconName: 'icon-wallet',
      soon: isMenuItemDisabled(Feature.EMBEDDED_WALLET),
      beta: isBetaFeature(Feature.EMBEDDED_WALLET),
      disabled:
        isMenuItemDisabled(Feature.EMBEDDED_WALLET) ||
        !authStore.isUserAllowed(Permission.EMBEDDED_WALLET) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-cloud-functions',
      label: t('dashboard.nav.cloudFunctions'),
      to: 'dashboard-service-cloud-functions',
      iconName: 'icon-cloud-functions',
      soon: isMenuItemDisabled(Feature.CLOUD_FUNCTIONS),
      beta: isBetaFeature(Feature.CLOUD_FUNCTIONS),
      disabled:
        isMenuItemDisabled(Feature.CLOUD_FUNCTIONS) ||
        !authStore.isUserAllowed(Permission.COMPUTING) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-rpc',
      label: t('dashboard.nav.rpc'),
      to: 'dashboard-service-rpc',
      iconName: 'icon-rpc',
      soon: isMenuItemDisabled(Feature.RPC),
      beta: isBetaFeature(Feature.RPC),
      disabled:
        isMenuItemDisabled(Feature.RPC) ||
        !authStore.isUserAllowed(Permission.RPC) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-indexing',
      label: t('dashboard.nav.indexing'),
      to: 'dashboard-service-indexing',
      iconName: 'icon-indexer',
      soon: isMenuItemDisabled(Feature.INDEXING),
      beta: isBetaFeature(Feature.INDEXING),
      disabled:
        isMenuItemDisabled(Feature.INDEXING) ||
        !authStore.isUserAllowed(Permission.INDEXING) ||
        zeroProjects.value,
    },
  ];

  const assetManagementDevelopment = [
    {
      key: 'dashboard-service-nft',
      label: t('dashboard.nav.nft'),
      to: 'dashboard-service-nft',
      iconName: 'icon-NFTs',
      soon: isMenuItemDisabled(Feature.NFT),
      disabled:
        isMenuItemDisabled(Feature.NFT) ||
        !authStore.isUserAllowed(Permission.NFTS) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-smart-contracts',
      label: t('dashboard.nav.smartContracts'),
      to: 'dashboard-service-smart-contracts',
      iconName: 'icon-file',
      soon: isMenuItemDisabled(Feature.SMART_CONTRACTS),
      beta: isBetaFeature(Feature.SMART_CONTRACTS),
      disabled: isMenuItemDisabled(Feature.SMART_CONTRACTS) || zeroProjects.value,
    },
    {
      key: 'dashboard-service-asset-hub',
      label: t('dashboard.nav.assetHub'),
      to: 'dashboard-service-asset-hub',
      svgIcon: 'icon/asset-hub',
      show: !isMenuItemDisabled(Feature.ASSET_HUB),
      beta: isBetaFeature(Feature.ASSET_HUB),
      disabled: isMenuItemDisabled(Feature.ASSET_HUB) || zeroProjects.value,
    },
  ];

  const utility = [
    {
      key: 'dashboard-service-computing',
      label: t('dashboard.nav.computing'),
      to: 'dashboard-service-computing',
      iconName: 'icon-computing',
      soon: isMenuItemDisabled(Feature.COMPUTING),
      disabled:
        isMenuItemDisabled(Feature.COMPUTING) ||
        !authStore.isUserAllowed(Permission.COMPUTING) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-authentication',
      label: t('dashboard.nav.authentication'),
      to: 'dashboard-service-authentication',
      iconName: 'icon-authentication',
      soon: isMenuItemDisabled(Feature.AUTHENTICATION),
      disabled:
        isMenuItemDisabled(Feature.AUTHENTICATION) ||
        !authStore.isUserAllowed(Permission.AUTHENTICATION) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-social',
      label: t('dashboard.nav.social'),
      to: 'dashboard-service-social',
      iconName: 'icon-social',
      disabled:
        isMenuItemDisabled(Feature.SOCIAL) ||
        !authStore.isUserAllowed(Permission.SOCIAL) ||
        zeroProjects.value,
    },
  ];

  const simplets = [
    {
      key: 'dashboard-solution-proof-of-attendance',
      label: t('dashboard.solution.nftPoap.name'),
      iconName: 'icon-poap',
      to: 'dashboard-solution-proof-of-attendance',
      disabled: zeroProjects.value,
    },
    {
      key: 'dashboard-solution-airdrop',
      label: t('dashboard.solution.nftAirdrop.name'),
      iconName: 'icon-nft-mint-airdrop',
      to: 'dashboard-solution-airdrop',
      disabled: zeroProjects.value,
    },
    {
      key: 'dashboard-solution-email-signup-airdrop',
      label: t('dashboard.solution.nftEmailSignupAirdrop.name'),
      iconName: 'icon-nft-drop',
      to: 'dashboard-solution-email-signup-airdrop',
      disabled: zeroProjects.value,
    },
    {
      key: 'dashboard-solution-whitelist-claim',
      label: t('dashboard.solution.nftWhitelistClaim.name'),
      iconName: 'icon-gift',
      to: 'dashboard-solution-whitelist-claim',
      disabled: zeroProjects.value,
    },
    {
      key: 'dashboard-solution-openGov',
      label: t('dashboard.solution.openGov.name'),
      iconName: 'icon-brand-membership',
      to: 'dashboard-solution-openGov',
      disabled: zeroProjects.value,
    },
  ];

  const configurationChildren = [
    {
      key: 'dashboard-project-settings',
      label: t('dashboard.nav.projectSettings'),
      to: 'dashboard-project-settings',
      iconName: 'icon-project-setting',
      disabled: isMenuItemDisabled(Feature.PROJECT_SETTINGS) || zeroProjects.value,
    },
    {
      key: 'dashboard-access',
      label: t('dashboard.nav.access'),
      to: 'dashboard-users-permissions',
      iconName: 'icon-acess',
      disabled: isMenuItemDisabled(Feature.ACCESS) || zeroProjects.value,
    },
    {
      key: 'dashboard-api-keys',
      label: t('dashboard.nav.apiKeys'),
      to: 'dashboard-api-keys',
      iconName: 'icon-api-keys',
      disabled: isMenuItemDisabled(Feature.API_KEYS) || zeroProjects.value,
      show: !dataStore.isProjectUser,
    },
    {
      key: 'dashboard-payments',
      label: t('dashboard.nav.billing'),
      to: 'dashboard-payments',
      iconName: 'icon-billing',
      disabled: isMenuItemDisabled(Feature.BILLING) || zeroProjects.value,
      show: !dataStore.isProjectUser,
    },
  ];

  return props.collapsed
    ? [
        dashboard,
        ...services,
        {
          key: 'divider-1',
          type: 'divider',
        },
        ...coreWeb3Infrastructure,
        {
          key: 'divider-2',
          type: 'divider',
        },
        ...assetManagementDevelopment,
        {
          key: 'divider-3',
          type: 'divider',
        },
        ...utility,
        {
          key: 'divider-4',
          type: 'divider',
        },
        ...simplets,
        ...configurationChildren,
      ]
    : [
        dashboard,
        ...services,
        {
          label: t('dashboard.nav.coreWeb3Infrastructure'),
          key: 'coreWeb3Infrastructure',
          children: [...coreWeb3Infrastructure],
        },
        {
          label: t('dashboard.nav.assetManagement'),
          key: 'assetManagement',
          children: [...assetManagementDevelopment],
        },
        {
          label: t('dashboard.nav.utility'),
          key: 'utility',
          children: [...utility],
        },
        {
          label: t('dashboard.nav.simplets'),
          key: 'simplets',
          children: [...simplets],
        },
        {
          label: t('dashboard.nav.configuration'),
          key: 'configuration',
          children: [...configurationChildren],
        },
      ];
});

/** Check if user has projects and if feature is enabled */
function isMenuItemDisabled(feature: Feature) {
  return !isFeatureEnabled(feature, authStore.getUserRoles());
}
</script>
