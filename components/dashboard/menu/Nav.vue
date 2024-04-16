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
    :default-expanded-keys="['services', 'configuration']"
    :options="menuOptions"
    @update:value="$emit('toggleSidebar')"
  />
</template>

<script lang="ts" setup>
import type { MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import { Feature } from '~/lib/types/config';

const props = defineProps({
  collapsed: { type: Boolean, default: false },
});
defineEmits(['toggleSidebar']);

const $i18n = useI18n();
const authStore = useAuthStore();
const dataStore = useDataStore();

const menuKey = computed<string>(() => `menu-${dataStore.project.items.length}`);
const zeroProjects = computed(() => dataStore.hasProjects === false);

const menuOptions = computed<MenuMixedOption[]>(() => {
  const dashboard = {
    key: 'dashboard',
    label: $i18n.t('dashboard.nav.projectOverview'),
    to: 'dashboard',
    iconName: 'icon-home',
    disabled: isMenuItemDisabled(Feature.PROJECT),
  };

  const servicesChildren = [
    {
      key: 'dashboard-service-storage',
      label: $i18n.t('dashboard.nav.storage'),
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
      label: $i18n.t('dashboard.nav.hosting'),
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
      label: $i18n.t('dashboard.nav.nft'),
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
      label: $i18n.t('dashboard.nav.authentication'),
      to: 'dashboard-service-authentication',
      iconName: 'icon-authentication',
      soon: isMenuItemDisabled(Feature.AUTHENTICATION),
      disabled:
        isMenuItemDisabled(Feature.AUTHENTICATION) ||
        !authStore.isUserAllowed(Permission.AUTHENTICATION) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-computing',
      label: $i18n.t('dashboard.nav.computing'),
      to: 'dashboard-service-computing',
      iconName: 'icon-computing',
      soon: isMenuItemDisabled(Feature.COMPUTING),
      disabled:
        isMenuItemDisabled(Feature.COMPUTING) ||
        !authStore.isUserAllowed(Permission.COMPUTING) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service-social',
      label: $i18n.t('dashboard.nav.social'),
      to: 'dashboard-service-social',
      iconName: 'icon-social',
      soon: isMenuItemDisabled(Feature.SOCIAL),
      disabled:
        isMenuItemDisabled(Feature.SOCIAL) ||
        !authStore.isUserAllowed(Permission.SOCIAL) ||
        zeroProjects.value,
    },
    {
      key: 'dashboard-service',
      label: $i18n.t('dashboard.nav.explore'),
      to: 'dashboard-service',
      class: 'text-yellow',
      iconName: 'icon-wide-right',
      show: !props.collapsed,
    },
  ];

  const smartContractsChildren = [
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
    {
      key: 'dashboard-smart-contracts',
      label: $i18n.t('dashboard.nav.explore'),
      class: 'text-yellow',
      iconName: 'icon-wide-right',
      show: !props.collapsed,
    },
  ];

  const solutionsChildren = isFeatureEnabled(Feature.PREBUILD_SOLUTIONS, authStore.getUserRoles())
    ? [
        {
          key: 'dashboard-solution-nft-airdrop',
          label: $i18n.t('dashboard.solution.nftAirdrop.name'),
          iconName: 'icon-nft-mint-airdrop',
          to: 'dashboard-solution-airdrop',
          disabled: zeroProjects.value,
        },
        {
          key: 'dashboard-solution-nft-email-signup-airdrop',
          label: $i18n.t('dashboard.solution.nftEmailSignupAirdrop.name'),
          iconName: 'icon-nft-drop',
          to: 'dashboard-solution-email-signup-airdrop',
          disabled: zeroProjects.value,
        },
        {
          key: 'dashboard-solution-poap',
          label: $i18n.t('dashboard.solution.nftPoap.name'),
          iconName: 'icon-poap',
          to: 'dashboard-solution-proof-of-attendance',
          disabled: zeroProjects.value,
        },
        {
          key: 'dashboard-solution-whitelist-claim',
          label: $i18n.t('dashboard.solution.nftWhitelistClaim.name'),
          iconName: 'icon-gift',
          to: 'dashboard-solution-whitelist-claim',
          disabled: zeroProjects.value,
        },
        {
          key: 'dashboard-solution-openGov',
          label: $i18n.t('dashboard.solution.openGov.name'),
          iconName: 'icon-brand-membership',
          to: 'dashboard-solution-openGov',
          disabled: zeroProjects.value,
        },
        {
          key: 'dashboard-solution',
          label: $i18n.t('dashboard.nav.explore'),
          to: 'dashboard-solution',
          class: 'text-yellow',
          iconName: 'icon-wide-right',
          show: !props.collapsed,
        },
      ]
    : [];

  const configurationChildren = [
    {
      key: 'dashboard-project-settings',
      label: $i18n.t('dashboard.nav.projectSettings'),
      to: 'dashboard-project-settings',
      iconName: 'icon-project-setting',
      disabled: isMenuItemDisabled(Feature.PROJECT_SETTINGS) || zeroProjects.value,
    },
    {
      key: 'dashboard-access',
      label: $i18n.t('dashboard.nav.access'),
      to: 'dashboard-users-permissions',
      iconName: 'icon-acess',
      disabled: isMenuItemDisabled(Feature.ACCESS) || zeroProjects.value,
    },
    {
      key: 'dashboard-api-keys',
      label: $i18n.t('dashboard.nav.apiKeys'),
      to: 'dashboard-api-keys',
      iconName: 'icon-api-keys',
      disabled: isMenuItemDisabled(Feature.API_KEYS) || zeroProjects.value,
      show: !dataStore.isProjectUser,
    },
    {
      key: 'dashboard-payments',
      label: $i18n.t('dashboard.nav.billing'),
      to: 'dashboard-payments',
      iconName: 'icon-billing',
      disabled: isMenuItemDisabled(Feature.BILLING) || zeroProjects.value,
      show: !dataStore.isProjectUser,
    },
  ];

  const solutionsMenu = isFeatureEnabled(Feature.PREBUILD_SOLUTIONS, authStore.getUserRoles())
    ? [
        {
          label: $i18n.t('dashboard.nav.solutions'),
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
          label: $i18n.t('dashboard.nav.services'),
          key: 'services',
          show: !props.collapsed,
          children: [...servicesChildren],
        },
        // {
        //   label: $i18n.t('dashboard.nav.smartContracts'),
        //   key: 'smart-contracts',
        //   children: [...smartContractsChildren],
        // },
        ...solutionsMenu,
        {
          label: $i18n.t('dashboard.nav.configuration'),
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
