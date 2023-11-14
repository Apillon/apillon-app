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
    :options="menuOptions"
  />
</template>

<script lang="ts" setup>
import type { MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import { Feature } from '~~/types/config';

const props = defineProps({
  collapsed: { type: Boolean, default: false },
});

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
      key: 'dashboard-service-nft',
      label: $i18n.t('dashboard.nav.nft'),
      to: 'dashboard-service-nft',
      iconName: 'icon-NFTs',
      soon: !isFeatureEnabled(Feature.NFT, authStore.getUserRoles()),
      disabled: isMenuItemDisabled(Feature.NFT) || !authStore.isUserAllowed(Permission.NFTS),
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
  ];
  const monitoringChildren = [
    {
      key: 'dashboard-analytics',
      label: $i18n.t('dashboard.nav.analytics'),
      iconName: 'icon-analytics',
      disabled: isMenuItemDisabled(Feature.MONITORING),
    },
    {
      key: 'dashboard-service-monitor',
      label: $i18n.t('dashboard.nav.serviceMonitor'),
      iconName: 'icon-service-monitor',
      disabled: isMenuItemDisabled(Feature.MONITORING),
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
        ...monitoringChildren,
        {
          key: 'divider-3',
          type: 'divider',
        },
        ...configurationChildren,
      ]
    : [
        dashboard,
        {
          type: 'group',
          label: $i18n.t('dashboard.nav.services'),
          key: 'services',
          show: !props.collapsed,
          children: [...servicesChildren],
        },
        {
          type: 'group',
          label: $i18n.t('dashboard.nav.monitoring'),
          key: 'monitoring',
          children: [...monitoringChildren],
        },
        {
          type: 'group',
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
