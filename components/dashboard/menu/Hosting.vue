<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const websiteStore = useWebsiteStore();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-hosting',
    label: t('hosting.menu.website'),
    path: '/dashboard/service/hosting',
  },
  {
    key: 'dashboard-service-hosting-archive',
    label: t('hosting.menu.archive'),
    path: '/dashboard/service/hosting/archive',
  },
];
</script>
