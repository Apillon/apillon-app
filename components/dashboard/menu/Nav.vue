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
const { name } = useRoute();

const menuKey = computed<string>(() => `menu-${dataStore.project.items.length}`);
const zeroProjects = computed(() => dataStore.hasProjects === false);

const defaultExpandedKeys = computed(() =>
  (name?.toString() || '').includes('solution')
    ? ['services', 'solutions', 'configuration']
    : ['services', 'configuration']
);

const menuOptions = computed<MenuMixedOption[]>(() => {
  const dashboard = {
    key: 'dashboard',
    label: t('dashboard.nav.projectOverview'),
    to: 'dashboard',
    iconName: 'icon-home',
    disabled: isMenuItemDisabled(Feature.PROJECT),
  };

  const servicesChildren = [
    {
      key: 'dashboard-service',
      label: t('dashboard.nav.explore'),
      to: 'dashboard-service',
      class: 'text-yellow',
      iconName: 'icon-wide-right',
      show: !props.collapsed,
    },
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
      key: 'dashboard-service-asset-hub',
      label: t('dashboard.nav.assetHub'),
      to: 'dashboard-service-asset-hub',
      iconName: 'icon-social',
      show: !isMenuItemDisabled(Feature.ASSET_HUB),
      disabled: isMenuItemDisabled(Feature.ASSET_HUB) || zeroProjects.value,
    },
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
      key: 'dashboard-service-cloud-functions',
      label: t('dashboard.nav.cloudFunctions'),
      to: 'dashboard-service-cloud-functions',
      iconName: 'icon-cloud-functions',
      show: !isMenuItemDisabled(Feature.CLOUD_FUNCTIONS),
      soon: isMenuItemDisabled(Feature.CLOUD_FUNCTIONS),
      disabled:
        isMenuItemDisabled(Feature.CLOUD_FUNCTIONS) ||
        !authStore.isUserAllowed(Permission.COMPUTING) ||
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
    {
      key: 'dashboard-service-embedded-wallet',
      label: t('dashboard.nav.embeddedWallet'),
      to: 'dashboard-service-embedded-wallet',
      iconName: 'icon-wallet',
      show: !isMenuItemDisabled(Feature.EMBEDDED_WALLET),
      soon: isMenuItemDisabled(Feature.EMBEDDED_WALLET),
      beta: isBetaFeature(Feature.EMBEDDED_WALLET),
      disabled:
        isMenuItemDisabled(Feature.EMBEDDED_WALLET) ||
        !authStore.isUserAllowed(Permission.EMBEDDED_WALLET) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-smart-contracts',
      label: t('dashboard.nav.smartContracts'),
      to: 'dashboard-service-smart-contracts',
      iconName: 'icon-file',
      show: !isMenuItemDisabled(Feature.SMART_CONTRACTS),
      soon: isMenuItemDisabled(Feature.SMART_CONTRACTS),
      disabled: isMenuItemDisabled(Feature.SMART_CONTRACTS) || zeroProjects.value,
    },
    {
      key: 'dashboard-service-indexing',
      label: t('dashboard.nav.indexing'),
      to: 'dashboard-service-indexing',
      iconName: 'icon-file',
      soon: isMenuItemDisabled(Feature.INDEXING),
      disabled:
        isMenuItemDisabled(Feature.INDEXING) ||
        !authStore.isUserAllowed(Permission.INDEXING) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-rpc',
      label: t('dashboard.nav.rpc'),
      to: 'dashboard-service-rpc',
      iconName: 'icon-web',
      soon: isMenuItemDisabled(Feature.RPC),
      disabled:
        isMenuItemDisabled(Feature.RPC) ||
        !authStore.isUserAllowed(Permission.RPC) ||
        zeroProjects.value,
    },
  ];

  const smartContractsChildren = [
    {
      key: 'dashboard-smart-contracts',
      label: t('dashboard.nav.explore'),
      class: 'text-yellow',
      iconName: 'icon-wide-right',
      show: !props.collapsed,
    },
    {
      key: 'dashboard-smart-erc-721',
      label: 'ERC-721',
      iconName: 'icon-erc-721',
      disabled: isMenuItemDisabled(Feature.ERC721) || zeroProjects.value,
    },
    {
      key: 'dashboard-smart-erc-20',
      label: 'ERC-20',
      iconName: 'icon-erc-20',
      disabled: isMenuItemDisabled(Feature.ERC20) || zeroProjects.value,
    },
    {
      key: 'dashboard-smart-erc-4437',
      label: 'ERC-4337',
      iconName: 'icon-erc-4437',
      disabled: isMenuItemDisabled(Feature.ERC4337) || zeroProjects.value,
    },
    {
      key: 'dashboard-smart-rmrk',
      label: 'RMRK',
      iconName: 'icon-rmrk',
      disabled: isMenuItemDisabled(Feature.RMRK) || zeroProjects.value,
    },
  ];

  const solutionsChildren = isFeatureEnabled(Feature.PREBUILD_SOLUTIONS, authStore.getUserRoles())
    ? [
        {
          key: 'dashboard-solution',
          label: t('dashboard.nav.explore'),
          to: 'dashboard-solution',
          class: 'text-yellow',
          iconName: 'icon-wide-right',
          show: !props.collapsed,
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
          key: 'dashboard-solution-proof-of-attendance',
          label: t('dashboard.solution.nftPoap.name'),
          iconName: 'icon-poap',
          to: 'dashboard-solution-proof-of-attendance',
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
      ]
    : [];

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

  const solutionsMenu = isFeatureEnabled(Feature.PREBUILD_SOLUTIONS, authStore.getUserRoles())
    ? [
        {
          label: t('dashboard.nav.solutions'),
          key: 'solutions',
          children: [...solutionsChildren],
        },
      ]
    : [];
  const solutionsMenuMobile = isFeatureEnabled(Feature.PREBUILD_SOLUTIONS, authStore.getUserRoles())
    ? [
        ...solutionsChildren,
        {
          key: 'divider-4',
          type: 'divider',
        },
      ]
    : [];

  return props.collapsed
    ? [
        dashboard,
        {
          key: 'divider-1',
          type: 'divider',
        },
        ...servicesChildren,
        {
          key: 'divider-2',
          type: 'divider',
        },
        // ...smartContractsChildren,
        // {
        //   key: 'divider-3',
        //   type: 'divider',
        // },
        ...solutionsMenuMobile,
        ...configurationChildren,
      ]
    : [
        dashboard,
        {
          label: t('dashboard.nav.services'),
          key: 'services',
          show: !props.collapsed,
          children: [...servicesChildren],
        },
        // {
        //   label: t('dashboard.nav.smartContracts'),
        //   key: 'smart-contracts',
        //   children: [...smartContractsChildren],
        // },
        ...solutionsMenu,
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
