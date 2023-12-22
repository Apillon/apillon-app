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
    key: 'dashboard-service-storage-ipfs',
    label: t('storage.ipfs.title'),
    path: `/dashboard/service/storage/ipfs`,
  },
];
</script>
