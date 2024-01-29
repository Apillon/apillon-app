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
    :default-expanded-keys="['services']"
    :options="menuOptions"
    @update:value="$emit('toggleSidebar')"
  />
</template>

<script lang="ts" setup>
import type { MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import { Feature } from '~~/types/config';

const props = defineProps({
  collapsed: { type: Boolean, default: false },
});
defineEmits(['toggleSidebar']);

const $i18n = useI18n();
const authStore = useAuthStore();
const dataStore = useDataStore();

const menuKey = computed<string>(() => {
  return `menu-${dataStore.project.items.length}`;
});

const menuOptions = computed<MenuMixedOption[]>(() => {
  const dashboard = {
    key: 'dashboard',
    label: $i18n.t('dashboard.nav.projectOverview'),
    to: 'dashboard',
    iconName: 'icon-home',
    disabled: !isFeatureEnabled(Feature.PROJECT, authStore.getUserRoles()),
  };
  const servicesChildren = [
    {
      key: 'dashboard-service-storage',
      label: $i18n.t('dashboard.nav.storage'),
      to: 'dashboard-service-storage',
      iconName: 'icon-storage',
      soon: !isFeatureEnabled(Feature.STORAGE, authStore.getUserRoles()),
      disabled: isMenuItemDisabled(Feature.STORAGE) || !authStore.isUserAllowed(Permission.STORAGE),
    },
    {
      key: 'dashboard-service-hosting',
      label: $i18n.t('dashboard.nav.hosting'),
      to: 'dashboard-service-hosting',
      iconName: 'icon-hosting',
      soon: !isFeatureEnabled(Feature.HOSTING, authStore.getUserRoles()),
      disabled: isMenuItemDisabled(Feature.HOSTING) || !authStore.isUserAllowed(Permission.HOSTING),
    },
    {
      key: 'dashboard-service-authentication',
      label: $i18n.t('dashboard.nav.authentication'),
      to: 'dashboard-service-authentication',
      iconName: 'icon-authentication',
      soon: !isFeatureEnabled(Feature.AUTHENTICATION, authStore.getUserRoles()),
      disabled:
        isMenuItemDisabled(Feature.AUTHENTICATION) ||
        !authStore.isUserAllowed(Permission.AUTHENTICATION),
    },
    {
      key: 'dashboard-service-computing',
      label: $i18n.t('dashboard.nav.computing'),
      to: 'dashboard-service-computing',
      iconName: 'icon-computing',
      soon: !isFeatureEnabled(Feature.COMPUTING, authStore.getUserRoles()),
      disabled:
        isMenuItemDisabled(Feature.COMPUTING) || !authStore.isUserAllowed(Permission.COMPUTING),
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
      disabled: isMenuItemDisabled(Feature.ERC721),
    },
    {
      key: 'dashboard-smart-erc-20',
      label: 'ERC-20',
      iconName: 'icon-erc-20',
      disabled: isMenuItemDisabled(Feature.ERC20),
    },
    {
      key: 'dashboard-smart-erc-4437',
      label: 'ERC-4337',
      iconName: 'icon-erc-4437',
      disabled: isMenuItemDisabled(Feature.ERC4337),
    },
    {
      key: 'dashboard-smart-rmrk',
      label: 'RMRK',
      iconName: 'icon-rmrk',
      disabled: isMenuItemDisabled(Feature.RMRK),
    },
    {
      key: 'dashboard-smart-contracts',
      label: $i18n.t('dashboard.nav.explore'),
      class: 'text-yellow',
      iconName: 'icon-wide-right',
      show: !props.collapsed,
    },
  ];
  const solutionsChildren = [
    {
      key: 'dashboard-solution-nft-collection',
      label: $i18n.t('dashboard.nav.solution.nftCollection'),
      iconName: 'icon-self-hosted-nft',
      to: 'dashboard-service-nft',
      disabled: isMenuItemDisabled(Feature.NFT),
    },
    {
      key: 'dashboard-solution-nft-airdrop',
      label: $i18n.t('dashboard.nav.solution.nftAirdrop'),
      iconName: 'icon-nft-mint-airdrop',
      disabled: isMenuItemDisabled(Feature.NFT_AIRDROP),
    },
    {
      key: 'dashboard-solution-nft-gift',
      label: $i18n.t('dashboard.nav.solution.nftGift'),
      iconName: 'icon-gift',
      disabled: isMenuItemDisabled(Feature.NFT_GIFT),
    },
    {
      key: 'dashboard-solution-poap',
      label: $i18n.t('dashboard.nav.solution.poap'),
      iconName: 'icon-poap',
      disabled: isMenuItemDisabled(Feature.NFT_ATTENDANCE),
    },
    {
      key: 'dashboard-solution-nft-loyalty',
      label: $i18n.t('dashboard.nav.solution.nftLoyalty'),
      iconName: 'icon-loyalty-program',
      disabled: isMenuItemDisabled(Feature.NFT_LOYALTY),
    },
    {
      key: 'dashboard-solution-nft-membership',
      label: $i18n.t('dashboard.nav.solution.nftMembership'),
      iconName: 'icon-brand-membership',
      disabled: isMenuItemDisabled(Feature.NFT_MEMBERSHIP),
    },
    {
      key: 'dashboard-solution-nft-drop',
      label: $i18n.t('dashboard.nav.solution.nftDrop'),
      iconName: 'icon-nft-drop',
      disabled: isMenuItemDisabled(Feature.NFT_DROP),
    },
    {
      key: 'dashboard-solution-wallet',
      label: $i18n.t('dashboard.nav.solution.wallet'),
      iconName: 'icon-wallet',
      disabled: isMenuItemDisabled(Feature.NON_CUSTODIAL_WALLET),
    },
    {
      key: 'dashboard-solution-file-sharing',
      label: $i18n.t('dashboard.nav.solution.fileSharing'),
      iconName: 'icon-file-sharing',
      disabled: isMenuItemDisabled(Feature.FILE_SHARING),
    },
    {
      key: 'dashboard-solution-token-gating',
      label: $i18n.t('dashboard.nav.solution.tokenGating'),
      iconName: 'icon-token-gating',
      disabled: isMenuItemDisabled(Feature.TOKEN_GATING),
    },
    {
      key: 'dashboard-smart-contracts',
      label: $i18n.t('dashboard.nav.explore'),
      to: 'dashboard-solution',
      class: 'text-yellow',
      iconName: 'icon-wide-right',
      show: !props.collapsed,
    },
  ];
  const configurationChildren = [
    {
      key: 'dashboard-project-settings',
      label: $i18n.t('dashboard.nav.projectSettings'),
      to: 'dashboard-project-settings',
      iconName: 'icon-project-setting',
      disabled: isMenuItemDisabled(Feature.PROJECT_SETTINGS),
    },
    {
      key: 'dashboard-access',
      label: $i18n.t('dashboard.nav.access'),
      to: 'dashboard-users-permissions',
      iconName: 'icon-acess',
      disabled: isMenuItemDisabled(Feature.ACCESS),
    },
    {
      key: 'dashboard-payments',
      label: $i18n.t('dashboard.nav.billing'),
      to: 'dashboard-payments',
      iconName: 'icon-billing',
      disabled: isMenuItemDisabled(Feature.BILLING),
      show: !dataStore.isProjectUser,
    },
    {
      key: 'dashboard-api-keys',
      label: $i18n.t('dashboard.nav.apiKeys'),
      to: 'dashboard-api-keys',
      iconName: 'icon-api-keys',
      disabled: isMenuItemDisabled(Feature.BILLING),
      show: !dataStore.isProjectUser,
    },
  ];

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
        ...smartContractsChildren,
        {
          key: 'divider-3',
          type: 'divider',
        },
        ...solutionsChildren,
        {
          key: 'divider-4',
          type: 'divider',
        },
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
        {
          label: $i18n.t('dashboard.nav.smartContracts'),
          key: 'smart-contracts',
          children: [...smartContractsChildren],
        },
        {
          label: $i18n.t('dashboard.nav.solutions'),
          key: 'solutions',
          children: [...solutionsChildren],
        },
        {
          label: $i18n.t('dashboard.nav.configuration'),
          key: 'configuration',
          children: [...configurationChildren],
        },
      ];
});

/** Check if user has projects and if feature is enabled */
function isMenuItemDisabled(feature: Feature) {
  return !isFeatureEnabled(feature, authStore.getUserRoles()) || dataStore.hasProjects === false;
}
</script>
