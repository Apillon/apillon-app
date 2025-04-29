<template>
  <Menu :options="menuOptions" mode="horizontal" slice-name />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-simplet',
    label: t('dashboard.simplet.menu.templates'),
    path: '/dashboard/simplet',
  },
  {
    key: 'dashboard-simplet-list',
    label: t('dashboard.simplet.menu.list'),
    path: '/dashboard/simplet/list',
  },
  {
    key: 'dashboard-simplet-archive',
    label: t('dashboard.simplet.menu.archive'),
    path: '/dashboard/simplet/archive',
  },
];
</script>
