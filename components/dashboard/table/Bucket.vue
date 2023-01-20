<template>
  <n-space :size="32" vertical>
    <StorageActions />

    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="data"
      :loading="dataStore.bucket.loading"
      :pagination="{ pageSize: PAGINATION_LIMIT }"
      :row-key="rowKey"
      :row-props="rowProps"
      @update:checked-row-keys="handleCheck"
    />
  </n-space>

  <!-- Modal - Edit bucket -->
  <modal v-model:show="showModalEditBucket" :title="$t('storage.bucket.edit')">
    <FormStorageBucket
      :bucket-id="currentRow?.id || 0"
      @submit-success="showModalEditBucket = false"
    />
  </modal>

  <!-- Modal - Destroy bucket -->
  <modal v-model:show="showModalDestroyBucket" :title="$t('storage.bucket.destroy')">
    <FormStorageDestroy :bucket-id="currentRow?.id || 0" />
  </modal>
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NEllipsis } from 'naive-ui';

const props = defineProps({
  buckets: { type: Array<BucketInterface>, default: [] },
});

const $i18n = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const showModalEditBucket = ref<boolean>(false);
const showModalDestroyBucket = ref<boolean>(false);
const StorageProgress = resolveComponent('StorageProgress');

/** Data: filtered buckets */
const data = computed<Array<BucketInterface>>(() => {
  return (
    props.buckets.filter(item =>
      item.name.toLocaleLowerCase().includes(dataStore.bucket.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<BucketInterface> => {
  return [
    {
      type: 'selection',
    },
    {
      key: 'name',
      title: $i18n.t('storage.bucket.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'serviceType',
      title: $i18n.t('storage.used'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
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
      key: 'description',
      title: $i18n.t('storage.bucket.description'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.description });
      },
    },
    {
      key: 'actions',
      title: $i18n.t('general.actions'),
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
const rowKey = (row: BucketItemInterface) => row.id;
const currentRow = ref<BucketInterface | null>(null);

const handleCheck = (rowKeys: Array<NDataTableRowKey>) => {
  const rowKeyIds = rowKeys.map(item => intVal(item));

  dataStore.bucket.selectedItems = dataStore.bucket.items.filter(item =>
    rowKeyIds.includes(item.id)
  );
};

/** On row click */
const rowProps = (row: BucketInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/storage/${row.id}` });
      }
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
    dataStore.promises.buckets = await dataStore.fetchBuckets();
  }
}
</script>
