<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const simpletStore = useSimpletStore();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-simplet',
    label: t('simplet.menu.templates'),
    path: '/dashboard/simplet',
  },
  {
    key: 'dashboard-simplet-list',
    label: t('simplet.menu.list'),
    counter: simpletStore.items.length,
    path: '/dashboard/simplet/list',
  },
  {
    key: 'dashboard-simplet-archive',
    label: t('simplet.menu.archive'),
    counter: simpletStore.archive.items.length,
    path: '/dashboard/simplet/archive',
  },
];
</script>
