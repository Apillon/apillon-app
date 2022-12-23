<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="dataStore.bucket.items"
    :row-props="rowProps"
  />

  <!-- Modal - Edit bucket -->
  <modal v-model:show="showModalEditBucket" :title="$t('storage.bucket.edit')">
    <FormStorageBucket :bucket-id="currentRow?.id || 0" />
  </modal>

  <!-- Modal - Destroy bucket -->
  <modal v-model:show="showModalDestroyBucket" :title="$t('storage.bucket.destroy')">
    <FormStorageDestroy :bucket-id="currentRow?.id || 0" />
  </modal>
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const NuxtLink = resolveComponent('NuxtLink');
const showModalEditBucket = ref<boolean>(false);
const showModalDestroyBucket = ref<boolean>(false);
const StorageProgress = resolveComponent('StorageProgress');

interface RowData extends BucketInterface {
  key: number;
}

const createColumns = (): DataTableColumns<RowData> => {
  return [
    {
      title: $i18n.t('storage.bucket.name'),
      key: 'name',
      render(row) {
        return h(
          NuxtLink,
          {
            class: 'ml-2 text-blue',
            to: `/dashboard/service/storage/${row.id}`,
          },
          () => row.name
        );
      },
    },
    {
      title: $i18n.t('storage.usage'),
      key: 'serviceType',
      render(row) {
        return h(
          StorageProgress,
          {
            size: row.size,
            maxSize: row.maxSize,
            percentage: row.percentage,
          },
          null
        );
      },
    },
    {
      title: $i18n.t('storage.bucket.description'),
      key: 'description',
    },
    {
      title: $i18n.t('storage.bucket.name'),
      key: 'name',
      render(row) {
        return h(
          NuxtLink,
          {
            class: 'ml-2 text-blue',
            to: `/dashboard/service/storage/${row.id}`,
          },
          () => row.name
        );
      },
    },
    {
      title: $i18n.t('general.actions'),
      key: 'actions',
      align: 'right',
      className: '!py-0',
      render() {
        return h(
          NDropdown,
          {
            options: dropdownOptions,
            trigger: 'click',
          },
          {
            default: () =>
              h(
                NButton,
                { size: 'small', quaternary: true },
                { default: () => h('span', { class: 'icon-more text-lg' }, {}) }
              ),
          }
        );
      },
    },
  ];
};
const columns = createColumns();
const currentRow = ref<RowData | null>(null);

const rowProps = (row: RowData) => {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
};

const dropdownOptions = [
  {
    label: $i18n.t('storage.edit'),
    key: 'storageEdit',
    disabled: settingsStore.isProjectUser(),
    props: {
      onClick: () => {
        showModalEditBucket.value = true;
      },
    },
  },
  {
    label: $i18n.t('storage.delete.bucket'),
    key: 'storage.delete.bucket',
    show: false,
    props: {
      onClick: () => {
        showModalDestroyBucket.value = true;
      },
    },
  },
];

/**
 * Load data on mounted
 */
onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(_ => {
      getBuckets();
    });
  }, 100);
});

async function getBuckets() {
  if (!dataStore.hasBuckets) {
    dataStore.promises.buckets = await dataStore.fetchBuckets($i18n);
  }
}
</script>
