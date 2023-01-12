<template>
  <Menu
    :slice-name="true"
    :inverted="true"
    :root-indent="32"
    :indent="0"
    :collapsed-width="32"
    :icon-size="20"
    :collapsed-icon-size="24"
    :options="menuOptions"
  />
</template>

<script lang="ts" setup>
const $i18n = useI18n();

const menuOptions: NMenuMixedOption[] = [
  {
    key: 'dashboard',
    label: $i18n.t('nav.projectOverview'),
    to: 'dashboard',
    iconName: 'icon-home',
    disabled: !isFeatureEnabled(Feature.PROJECT),
  },
  {
    type: 'group',
    label: $i18n.t('nav.services'),
    key: 'services',
    children: [
      {
        key: 'dashboard-service-authentication',
        label: $i18n.t('nav.authentication'),
        to: 'dashboard-service-authentication',
        iconName: 'icon-authentication',
        new: isFeatureEnabled(Feature.AUTHENTICATION),
        disabled: !isFeatureEnabled(Feature.AUTHENTICATION),
      },
      {
        key: 'dashboard-service-storage',
        label: $i18n.t('nav.storage'),
        to: 'dashboard-service-storage',
        iconName: 'icon-storage',
        new: isFeatureEnabled(Feature.STORAGE),
        disabled: !isFeatureEnabled(Feature.STORAGE),
      },
      {
        key: 'dashboard-service-computing',
        label: $i18n.t('nav.computing'),
        iconName: 'icon-computing',
        soon: !isFeatureEnabled(Feature.COMPUTING),
        disabled: !isFeatureEnabled(Feature.COMPUTING),
      },
    ],
  },
  {
    type: 'group',
    label: $i18n.t('nav.monitoring'),
    key: 'monitoring',
    children: [
      {
        key: 'dashboard-analytics',
        label: $i18n.t('nav.analytics'),
        iconName: 'icon-analytics',
        disabled: !isFeatureEnabled(Feature.MONITORING),
      },
      {
        key: 'dashboard-service-monitor',
        label: $i18n.t('nav.serviceMonitor'),
        iconName: 'icon-service-monitor',
        disabled: !isFeatureEnabled(Feature.MONITORING),
      },
    ],
  },
  {
    type: 'group',
    label: $i18n.t('nav.configuration'),
    key: 'configuration',
    children: [
      {
        key: 'dashboard-project-settings',
        label: $i18n.t('nav.projectSettings'),
        to: 'dashboard-project-settings',
        iconName: 'icon-project-setting',
        disabled: !isFeatureEnabled(Feature.PROJECT_SETTINGS),
      },
      {
        key: 'dashboard-access',
        label: $i18n.t('nav.access'),
        iconName: 'icon-acess',
        disabled: !isFeatureEnabled(Feature.ACCESS),
      },
      {
        key: 'dashboard-billing',
        label: $i18n.t('nav.billing'),
        to: 'dashboard-billing',
        iconName: 'icon-billing',
        disabled: !isFeatureEnabled(Feature.BILLING),
      },
    ],
  },
];
</script>
