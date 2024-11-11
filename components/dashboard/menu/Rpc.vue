<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-rpc',
    label: t('rpc.apiKey.yourEndpoints'),
    path: `/dashboard/service/rpc`,
  },
  {
    key: 'dashboard-service-rpc-usage',
    label: t('rpc.apiKey.usage'),
    path: `/dashboard/service/rpc/usage`,
  },
];
</script>
