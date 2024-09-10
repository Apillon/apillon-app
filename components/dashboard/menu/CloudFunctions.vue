<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const cloudFunctionStore = useCloudFunctionStore();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-cloud-functions-id',
    label: t('computing.cloudFunctions.monitoring'),
    path: `/dashboard/service/cloud-functions/${cloudFunctionStore.functionUuid}`,
  },
  {
    key: 'dashboard-service-cloud-functions-slug-deployments',
    label: t('computing.cloudFunctions.deployments'),
    path: `/dashboard/service/cloud-functions/${cloudFunctionStore.functionUuid}/deployments`,
  },
  {
    key: 'dashboard-service-cloud-functions-slug-variables',
    label: t('computing.cloudFunctions.variables'),
    path: `/dashboard/service/cloud-functions/${cloudFunctionStore.functionUuid}/variables`,
  },
];
</script>
