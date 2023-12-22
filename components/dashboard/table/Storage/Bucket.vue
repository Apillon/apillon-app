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
      :loading="bucketStore.loading"
      :pagination="{ pageSize: PAGINATION_LIMIT }"
      :row-key="rowKey"
      :row-props="rowProps"
      @update:checked-row-keys="handleCheck"
    />
  </n-space>

  <!-- Modal - Edit bucket -->
  <modal v-model:show="showModalEditBucket" :title="$t('storage.bucket.edit')">
    <FormStorageBucket
      :bucket-uuid="currentRow.bucket_uuid"
      @submit-success="showModalEditBucket = false"
    />
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
  <W3Warn v-model:show="showModalW3Warn" @submit="onModalW3WarnHide">
    {{ $t('w3Warn.bucket.delete') }}
  </W3Warn>
</template>

<script lang="ts" setup>
import type { DataTableRowKey } from 'naive-ui';
import { NButton, NDropdown, NEllipsis } from 'naive-ui';

const props = defineProps({
  buckets: { type: Array<BucketInterface>, default: [] },
  deleted: { type: Boolean, default: false },
});

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const storageStore = useStorageStore();

const showModalW3Warn = ref<boolean>(false);
const showModalEditBucket = ref<boolean>(false);
const showModalDestroyBucket = ref<boolean | null>(false);
const checkedRowKeys = ref<Array<string | number>>([]);
const bucketsToDelete = ref<BucketInterface[]>([]);
const TableEllipsis = resolveComponent('TableEllipsis');

/** Data: filtered buckets */
const data = computed<Array<BucketInterface>>(() => {
  return (
    props.buckets.filter(
      item =>
        (bucketStore.filter.bucketType === null ||
          item.bucketType === bucketStore.filter.bucketType) &&
        item.name.toLocaleLowerCase().includes(bucketStore.filter.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<BucketInterface> => {
  return [
    {
      type: 'selection',
      className: props.deleted ? 'hidden' : '',
    },
    {
      key: 'name',
      title: $i18n.t('storage.bucket.name'),
      className: props.deleted ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'type',
      title: $i18n.t('storage.bucket.type'),
      className: props.deleted ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        if (row.bucketType > 0 && $i18n.te(`storage.type.${row.bucketType}`)) {
          return h('span', {}, { default: () => $i18n.t(`storage.type.${row.bucketType}`) });
        }
        return '';
      },
    },
    {
      key: 'bucket_uuid',
      title: $i18n.t('storage.bucket.uuid'),
      render(row: BucketInterface) {
        return h(TableEllipsis, { text: row.bucket_uuid }, '');
      },
    },
    {
      key: 'used',
      title: $i18n.t('storage.used'),
      className: props.deleted ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return (
          formatBytes(row?.size || 0) +
          ' (' +
          storagePercentage(row?.size || 0, storageStore.info.availableStorage) +
          '%)'
        );
      },
    },
    {
      key: 'description',
      title: $i18n.t('storage.bucket.description'),
      className: props.deleted ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.description });
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      className: '!py-0',
      render() {
        return h(
          NDropdown,
          {
            options: props.deleted ? dropdownDeletedOptions : dropdownOptions,
            trigger: 'click',
          },
          {
            default: () =>
              h(
                NButton,
                { type: 'tertiary', size: 'small', quaternary: true, round: true },
                { default: () => h('span', { class: 'icon-more text-2xl' }, {}) }
              ),
          }
        );
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: BucketInterface) => row.bucket_uuid;
const currentRow = ref<BucketInterface>(props.buckets[0]);

const handleCheck = (rowKeys: Array<DataTableRowKey>) => {
  checkedRowKeys.value = rowKeys;
  bucketStore.selectedItems = bucketStore.items.filter(item => rowKeys.includes(item.bucket_uuid));
};

/** On row click */
const rowProps = (row: BucketInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/storage/${row.bucket_uuid}` });
      }
    },
  };
};

const dropdownOptions = [
  {
    key: 'storageEdit',
    label: $i18n.t('storage.edit'),
    disabled: dataStore.isProjectUser,
    props: {
      onClick: () => {
        showModalEditBucket.value = true;
      },
    },
  },
  {
    key: 'storageDelete',
    label: $i18n.t('general.delete'),
    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
      onClick: () => {
        deleteBucket(true);
      },
    },
  },
];

const dropdownDeletedOptions = [
  {
    key: 'storageRestore',
    label: $i18n.t('general.restore'),
    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
      onClick: () => {
        restoreBucket();
      },
    },
  },
];

/**
 * On deleteBucket click
 * If W3Warn has already been shown, show modal delete bucket, otherwise show warn first
 * */
function deleteBucket(isCurrentRow = false) {
  bucketsToDelete.value = isCurrentRow ? [currentRow.value] : bucketStore.selectedItems;

  if (localStorage.getItem(LsW3WarnKeys.BUCKET_DELETE)) {
    showModalDestroyBucket.value = true;
  } else {
    showModalW3Warn.value = true;
    showModalDestroyBucket.value = null;
  }
}

/** When user close W3Warn, allow him to create new bucket */
function onModalW3WarnHide() {
  if (showModalDestroyBucket.value !== false) {
    showModalDestroyBucket.value = true;
  }
}

/** Watch showModalW3Warn, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      localStorage.setItem(LsW3WarnKeys.BUCKET_DELETE, Date.now().toString());
    }
  }
);

/**
 * On bucket deleted
 * Hide modal and refresh bucket list
 * */
function onBucketDeleted() {
  bucketStore.loading = true;
  showModalDestroyBucket.value = false;

  /** Reset selected items */
  handleCheck([]);

  setTimeout(() => {
    bucketStore.fetchBuckets();
  }, 500);
}

/**
 * Restore bucket
 * */
async function restoreBucket() {
  bucketStore.loading = true;

  try {
    const response = await $api.patch<BucketResponse>(
      endpoints.bucketRestore(currentRow.value.bucket_uuid)
    );
    removeDeletedBucketFromList(response.data.bucket_uuid);

    message.success($i18n.t('form.success.restored.bucket'));
  } catch (error) {
    window.$message.error(userFriendlyMsg(error));
  }
  bucketStore.loading = false;

  setTimeout(() => {
    router.push({ name: 'dashboard-service-storage' });
  }, 1000);
}

function removeDeletedBucketFromList(uuid: string) {
  bucketStore.fetchBuckets();
  bucketStore.destroyed = bucketStore.destroyed.filter(item => item.bucket_uuid !== uuid);
}
</script>
