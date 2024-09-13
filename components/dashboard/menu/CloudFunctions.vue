<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-cloud-functions',
    label: t('dashboard.nav.cloudFunctions'),
    path: `/dashboard/service/cloud-functions`,
  },
  {
    key: 'dashboard-service-cloud-functions-archive',
    label: t('general.archive'),
    path: '/dashboard/service/cloud-functions/archive',
  },
];
</script>
