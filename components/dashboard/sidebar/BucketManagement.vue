<template>
  <div>
    <n-menu v-model:value="selectedMenu" :options="menuOptions" />

    <!-- Modal - Destroy bucket -->
    <modal v-model:show="showModalDestroyBucket" :title="$t('storage.bucket.destroy')">
      <FormStorageDestroy :bucket-id="dataStore.bucket.selected" />
    </modal>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import type { MenuOption } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { name } = useRoute();
const dataStore = useDataStore();
const showModalDestroyBucket = ref<boolean>(false);
const NuxtLink = resolveComponent('NuxtLink');

const selectedMenu = ref(name?.toString());

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(NuxtLink, { to: { path: `/dashboard/service/storage/${dataStore.bucket.selected}` } }, () =>
        t('storage.files')
      ),
    key: 'dashboard-service-storage-id',
  },
  {
    label: () =>
      h(
        NuxtLink,
        { to: { path: `/dashboard/service/storage/${dataStore.bucket.selected}/all` } },
        () => t('storage.filesAll')
      ),
    key: 'dashboard-service-storage-slug-all',
  },
  {
    label: () =>
      h(
        NuxtLink,
        { to: { path: `/dashboard/service/storage/${dataStore.bucket.selected}/webhook` } },
        () => t('storage.webhook')
      ),
    key: 'dashboard-service-storage-slug-webhook',
  },
  {
    label: () => h('span', {}, t('storage.snapshots')),
    key: 'snapshots',
    disabled: true,
    show: false,
  },
  {
    label: () => h('span', {}, t('storage.stats')),
    key: 'stats',
    disabled: true,
    show: false,
  },
  {
    label: () => h('span', {}, t('storage.history')),
    key: 'history',
    disabled: true,
    show: false,
  },
  {
    label: () => h('span', {}, t('storage.destroy')),
    key: 'delete',
    show: false,
    onClick: () => (showModalDestroyBucket.value = true),
  },
];
</script>
