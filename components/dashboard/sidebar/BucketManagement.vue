<template>
  <div>
    <n-menu v-model:value="selectedMenu" :options="menuOptions" :render-label="renderMenuLabel" />

    <!-- Modal - Destroy bucket -->
    <modal v-model:show="showModalDestroyBucket" :title="$t('storage.bucket.destroy')">
      <FormStorageDestroy :bucket-id="dataStore.bucket.selected" />
    </modal>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';

const { t } = useI18n();
const dataStore = useDataStore();

const { name } = useRoute();
const selectedMenu = ref(name?.toString());

const showModalDestroyBucket = ref<boolean>(false);
const NuxtLink = resolveComponent('NuxtLink');

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

function renderMenuLabel(option: NMenuOption) {
  if ('href' in option) {
    return h('a', { href: option.href, target: '_blank' }, () => option.label as string);
  } else if ('path' in option) {
    return h(NuxtLink, { to: { path: option.path } }, () => option.label as string);
  } else if ('to' in option) {
    return h(NuxtLink, { to: { name: option.to } }, () => option.label as string);
  }
  return h('span', { class: 'text' }, { default: () => option.label as string });
}
</script>
