<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-computing',
    label: t('computing.contract.list'),
    path: '/dashboard/service/computing',
  },
  {
    key: 'dashboard-service-computing-archive',
    label: t('general.archive'),
    path: '/dashboard/service/computing/archive',
  },
];
</script>
