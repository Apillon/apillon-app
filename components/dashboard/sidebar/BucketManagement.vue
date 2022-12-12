<template>
  <div>
    <n-menu v-model:value="selectedMenu" :options="menuOptions" />

    <!-- Modal - Destroy bucket -->
    <n-modal v-model:show="showModalDestroyBucket">
      <n-card
        style="width: 660px"
        :title="$t('storage.bucketDestroy')"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <FormStorageDestroy :bucket-id="dataStore.selected.bucketId" />
      </n-card>
    </n-modal>
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

const selectedMenu = computed(() => {
  return name || '';
});

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        NuxtLink,
        { to: { path: `/dashboard/service/storage/${dataStore.selected.bucketId}` } },
        () => t('storage.files')
      ),
    key: 'dashboard-service-storage-id',
  },
  {
    label: () => h('span', {}, t('storage.snapshots')),
    key: 'snapshots',
    disabled: true,
  },
  {
    label: () => h('span', {}, t('storage.stats')),
    key: 'stats',
    disabled: true,
  },
  {
    label: () => h('span', {}, t('storage.history')),
    key: 'history',
    disabled: true,
  },
  {
    label: () => h('span', {}, t('storage.destroy')),
    key: 'delete',
    onClick: () => (showModalDestroyBucket.value = true),
  },
];
</script>
