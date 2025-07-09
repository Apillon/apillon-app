<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const cloudFunctionsStore = useCloudFunctionStore();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-cloud-functions',
    label: t('dashboard.nav.cloudFunctions'),
    counter: cloudFunctionsStore.items.length,
    path: `/dashboard/service/cloud-functions`,
  },
  {
    key: 'dashboard-service-cloud-functions-archive',
    label: t('general.archive'),
    counter: cloudFunctionsStore.archive.length,
    path: '/dashboard/service/cloud-functions/archive',
  },
];
</script>
