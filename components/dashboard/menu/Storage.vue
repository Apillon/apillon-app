<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-storage',
    label: t('storage.bucket.buckets'),
    path: `/dashboard/service/storage`,
  },
  {
    key: 'dashboard-service-storage-destroyed',
    label: t('storage.bucket.destroyed'),
    path: `/dashboard/service/storage/destroyed`,
  },
];
</script>
