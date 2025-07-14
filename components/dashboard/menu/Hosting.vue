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
    counter: websiteStore.items.length,
    path: '/dashboard/service/hosting',
  },
  {
    key: 'dashboard-service-hosting-archive',
    label: t('hosting.menu.archive'),
    counter: websiteStore.archive.length,
    path: '/dashboard/service/hosting/archive',
  },
];
</script>
