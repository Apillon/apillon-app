<template>
  <n-space class="pb-8" :size="32" vertical>
    <ActionsStorage @on-bucket-delete="deleteBucket" />

    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      v-model:checked-row-keys="checkedRowKeys"
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
    <FormStorageBucket :bucket-id="currentRow.id" @submit-success="showModalEditBucket = false" />
  </modal>

  <!-- Modal - Destroy bucket -->
  <ModalDelete v-model:show="showModalDestroyBucket" :title="$t('storage.bucket.delete')">
    <template #content>
      <p class="text-body">
        {{ $t('storage.bucket.deleteConfirm', { num: bucketsToDelete.length || 1 }) }}
      </p>
    </template>

    <slot>
      <FormDeleteItems :items="bucketsToDelete" @submit-success="onBucketDeleted()" />
    </slot>
  </ModalDelete>

  <!-- W3Warn: delete bucket -->
  <W3Warn v-model:show="showModalW3Warn" @update:show="onModalW3WarnHide">
    {{ $t('w3Warn.bucket.delete') }}
  </W3Warn>
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

const showModalW3Warn = ref<boolean>(false);
const showModalEditBucket = ref<boolean>(false);
const showModalDestroyBucket = ref<boolean | null>(false);
const checkedRowKeys = ref<Array<string | number>>([]);
const bucketsToDelete = ref<Array<BucketInterface>>([]);
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
      key: 'bucket_uuid',
      title: $i18n.t('storage.bucket.uuid'),
      render(row: BucketInterface) {
        return [
          h(
            'div',
            { class: 'flex' },
            {
              default: () => [
                h(
                  NEllipsis,
                  { class: 'text-grey align-bottom', 'line-clamp': 1 },
                  { default: () => row.bucket_uuid }
                ),
                h(
                  'button',
                  { class: 'ml-2', onClick: () => copyToClipboard(row.bucket_uuid) },
                  h('span', { class: 'icon-copy text-grey' }, {})
                ),
              ],
            }
          ),
        ];
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
const currentRow = ref<BucketInterface>(props.buckets[0]);

const handleCheck = (rowKeys: Array<NDataTableRowKey>) => {
  checkedRowKeys.value = rowKeys;
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
    key: 'storage.delete.bucket',
    label: $i18n.t('general.delete'),
    props: {
      class: '!text-pink',
      onClick: () => {
        deleteBucket(true);
      },
    },
  },
];

/**
 * On deleteBucket click
 * If W3Warn has already been shown, show modal delete bucket, otherwise show warn first
 * */
function deleteBucket(isCurrentRow: boolean = false) {
  bucketsToDelete.value = isCurrentRow ? [currentRow.value] : dataStore.bucket.selectedItems;

  if (sessionStorage.getItem(LsW3WarnKeys.BUCKET_DELETE)) {
    showModalDestroyBucket.value = true;
  } else {
    showModalW3Warn.value = true;
    showModalDestroyBucket.value = null;
  }
}

/** When user close W3Warn, allow him to create new bucket */
function onModalW3WarnHide(value: boolean) {
  if (!value && showModalDestroyBucket.value !== false) {
    showModalDestroyBucket.value = true;
  }
}

/** Watch showModalW3Warn, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      sessionStorage.setItem(LsW3WarnKeys.BUCKET_DELETE, Date.now().toString());
    }
  }
);

/**
 * On bucket deleted
 * Hide modal and refresh bucket list
 * */
function onBucketDeleted() {
  dataStore.bucket.loading = true;
  showModalDestroyBucket.value = false;

  /** Reset selected items */
  handleCheck([]);

  setTimeout(() => {
    dataStore.fetchBuckets();
  }, 300);
}
</script>
