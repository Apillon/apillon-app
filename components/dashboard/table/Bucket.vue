<template>
  <n-data-table :bordered="false" :columns="columns" :data="tableData" :row-props="rowProps" />

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
import { NButton, NDropdown, NEllipsis } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';

const props = defineProps({
  bucketType: {
    type: Number,
    validator: (value: number) =>
      Object.values(BucketType)
        .filter(value => !isNaN(Number(value)))
        .includes(value),
    default: BucketType.STORAGE,
  },
});

const $i18n = useI18n();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const NuxtLink = resolveComponent('NuxtLink');
const showModalEditBucket = ref<boolean>(false);
const showModalDestroyBucket = ref<boolean>(false);
const StorageProgress = resolveComponent('StorageProgress');

const createColumns = (): DataTableColumns<BucketInterface> => {
  return [
    {
      title: $i18n.t('storage.bucket.name'),
      key: 'name',
      render(row) {
        return h(
          NuxtLink,
          {
            class: 'ml-2 text-blue',
            to:
              row.bucketType === BucketType.HOSTING
                ? `/dashboard/service/hosting/${row.id}`
                : `/dashboard/service/storage/${row.id}`,
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
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.description });
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
const currentRow = ref<BucketInterface | null>(null);

const rowProps = (row: BucketInterface) => {
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

/** Table data - filter buckets by bucket type (storage/hosting) */
const tableData = computed<Array<BucketInterface>>(() => {
  return dataStore.bucket.items.filter(item => item.bucketType === props.bucketType);
});

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
    dataStore.promises.buckets = await dataStore.fetchBuckets();
  }
}
</script>
