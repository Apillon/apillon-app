<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-hosting-id',
    label: t('hosting.menu.preview'),
    path: `/dashboard/service/hosting/${dataStore.webpage.selected}`,
  },
  {
    key: 'dashboard-service-hosting-slug-staging',
    label: t('hosting.menu.staging'),
    path: `/dashboard/service/hosting/${dataStore.webpage.selected}/staging`,
  },
  {
    key: 'dashboard-service-hosting-slug-production',
    label: t('hosting.menu.production'),
    path: `/dashboard/service/hosting/${dataStore.webpage.selected}/production`,
  },
];
</script>
