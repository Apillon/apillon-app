<template>
  <Menu :options="menuOptions" mode="horizontal">
    <!-- Modal - Destroy bucket -->
    <modal v-model:show="showModalDestroyBucket" :title="$t('storage.bucket.destroy')">
      <FormStorageDestroy :bucket-id="dataStore.bucket.selected" />
    </modal>
  </Menu>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const showModalDestroyBucket = ref<boolean>(false);

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-storage-id',
    label: t('storage.files'),
    path: `/dashboard/service/storage/${dataStore.bucket.selected}`,
  },
  {
    key: 'dashboard-service-storage-slug-all',
    label: t('storage.filesAll'),
    path: `/dashboard/service/storage/${dataStore.bucket.selected}/all`,
  },
  {
    key: 'dashboard-service-storage-slug-webhook',
    label: t('storage.webhook'),
    path: `/dashboard/service/storage/${dataStore.bucket.selected}/webhook`,
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
  {
    key: 'delete',
    label: t('storage.destroy'),
    show: false,
    onClick: () => (showModalDestroyBucket.value = true),
  },
];
</script>
