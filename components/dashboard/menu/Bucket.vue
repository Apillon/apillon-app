<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const bucketStore = useBucketStore();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-storage-id',
    label: t('storage.files'),
    path: `/dashboard/service/storage/${bucketStore.selected}`,
  },
  {
    key: 'dashboard-service-storage-slug-session',
    label: t('storage.filesAll'),
    path: `/dashboard/service/storage/${bucketStore.selected}/session`,
  },
  {
    key: 'dashboard-service-storage-slug-webhook',
    label: t('storage.webhook'),
    path: `/dashboard/service/storage/${bucketStore.selected}/webhook`,
  },
  {
    key: 'dashboard-service-storage-slug-ipns',
    label: t('storage.ipns.title'),
    path: `/dashboard/service/storage/${bucketStore.selected}/ipns`,
  },
  {
    key: 'dashboard-service-storage-slug-trash',
    label: t('storage.trash'),
    path: `/dashboard/service/storage/${bucketStore.selected}/trash`,
  },
  {
    key: 'snapshots',
    label: t('storage.snapshots'),
    disabled: true,
    show: false,
  },
  {
    key: 'stats',
    label: t('storage.stats'),
    disabled: true,
    show: false,
  },
  {
    key: 'history',
    label: t('storage.history'),
    disabled: true,
    show: false,
  },
];
</script>
