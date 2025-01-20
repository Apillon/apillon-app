<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-smart-contracts',
    label: t('dashboard.nav.smartContracts'),
    path: '/dashboard/service/smart-contracts',
  },
  {
    key: 'dashboard-service-smart-contracts-archive',
    label: t('general.archive'),
    path: '/dashboard/service/smart-contracts/archive',
  },
];
</script>
