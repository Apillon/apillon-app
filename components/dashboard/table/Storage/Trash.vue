<template>
  <n-space class="pb-8" :size="12" vertical>
    <n-space justify="space-between">
      <div class="w-[45vw] sm:w-[30vw] lg:w-[20vw] max-w-xs">
        <n-input
          v-model:value="fileStore.trash.search"
          type="text"
          name="search"
          size="small"
          :placeholder="$t('storage.file.search')"
          clearable
        >
          <template #prefix>
            <span class="icon-search text-2xl"></span>
          </template>
        </n-input>
      </div>

      <n-space size="large">
        <!-- Refresh files -->
        <n-button
          size="small"
          :loading="fileStore.trash.loading"
          @click="fileStore.fetchDeletedFiles()"
        >
          <span class="icon-refresh text-xl mr-2"></span>
          {{ $t('general.refresh') }}
        </n-button>
      </n-space>
    </n-space>
    <n-data-table
      ref="tableRef"
      :bordered="false"
      :columns="columns"
      :data="fileStore.trash.items"
      :loading="fileStore.trash.loading"
      :pagination="{
        ...fileStore.trash.pagination,
        prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
      }"
      :row-props="rowProps"
      @update:page="handlePageChange"
      @update:sorter="handleSorterChange"
      remote
    />
  </n-space>
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
import type { DataTableSortState, DataTableInst } from 'naive-ui';
import { NButton, NDropdown, NEllipsis, useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const bucketStore = useBucketStore();
const fileStore = useFileStore();
const IconFolderFile = resolveComponent('IconFolderFile');
const TableEllipsis = resolveComponent('TableEllipsis');

const tableRef = ref<DataTableInst | null>(null);
const currentRow = ref<BucketItemInterface>({} as BucketItemInterface);
const sort = ref<DataTableSortState | null | undefined>();

/** Columns */
const createColumns = (): NDataTableColumns<BucketItemInterface> => {
  return [
    {
      key: 'name',
      minWidth: 200,
      sorter: 'default',
      title: $i18n.t('storage.fileName'),
      render(row) {
        return [h(IconFolderFile, { isFile: true }, ''), h('span', { class: 'ml-2 ' }, row.name)];
      },
    },
    {
      key: 'CID',
      sorter: 'default',
      title: $i18n.t('storage.fileCid'),
      render(row) {
        return h(TableEllipsis, { text: row.CID }, '');
      },
    },
    {
      key: 'link',
      title: $i18n.t('storage.downloadLink'),
      render(row: BucketItemInterface) {
        if (row.CID) {
          return [
            h(
              'div',
              { class: 'flex' },
              {
                default: () => [
                  h(
                    NEllipsis,
                    { class: 'text-body align-bottom', 'line-clamp': 1 },
                    { default: () => row.link }
                  ),
                  h(
                    'button',
                    { class: 'ml-2', onClick: () => copyToClipboard(row.link) },
                    h('span', { class: 'icon-copy text-body' }, {})
                  ),
                ],
              }
            ),
          ];
        }
        return '';
      },
    },
    {
      key: 'size',
      sorter: 'default',
      title: $i18n.t('storage.fileSize'),
      render(row: BucketItemInterface) {
        if (row.size) {
          return h('span', {}, { default: () => formatBytes(row.size || 0) });
        }
        return '';
      },
    },
    {
      key: 'createTime',
      sorter: 'default',
      title: $i18n.t('dashboard.created'),
      render(row: BucketItemInterface) {
        return h('span', {}, { default: () => dateTimeToDate(row.createTime || '') });
      },
    },
    {
      key: 'createTime',
      title: $i18n.t('dashboard.deletedAt'),
      render(row: BucketItemInterface) {
        return h(
          'span',
          {},
          { default: () => dateTimeToDateForDeletedFiles(row.updateTime || '') }
        );
      },
    },
    {
      key: 'contentType',
      sorter: 'default',
      title: $i18n.t('storage.contentType'),
      render(row: BucketItemInterface) {
        if (row.contentType) {
          return h('span', {}, row.contentType);
        }
        return '';
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
            options: dropdownOptions,
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

/** Dropdown options for files */
const dropdownOptions = [
  {
    key: 'restore',
    label: $i18n.t('general.restore'),
    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
      onClick: () => {
        restore();
      },
    },
  },
];

function rowProps(row: BucketItemInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

/** Sort column - fetch directory content with order params  */
async function handleSorterChange(sorter?: DataTableSortState) {
  sort.value = sorter && sorter.order !== false ? sorter : null;
  if (sorter) {
    await getDeletedFiles();
  }
}

/** Reset sort if user search change directory or search directory content */
function clearSorter() {
  if (tableRef.value) {
    tableRef.value.sort(0, false);
  }
}

/** Search folders and files */
watch(
  () => fileStore.trash.search,
  _ => {
    debouncedSearchFilter();
    clearSorter();
  }
);
const debouncedSearchFilter = debounce(getDeletedFiles, 500);

/** On page change, load data */
async function handlePageChange(currentPage: number) {
  if (!fileStore.trash.loading) {
    await getDeletedFiles(currentPage);
  }
}

async function getDeletedFiles(page = 1) {
  fileStore.trash.pagination.page = page;

  await fileStore.fetchDeletedFiles({
    page,
    search: fileStore.trash.search,
    orderBy: sort.value ? `${sort.value.columnKey}` : undefined,
    order: sort.value ? `${sort.value.order}` : undefined,
  });
}

/**
 * Restore file
 * */
async function restore() {
  bucketStore.loading = true;

  try {
    const restoredFile = await $api.patch<BucketItemResponse>(
      endpoints.storageFileRestore(
        bucketStore.bucketUuid,
        currentRow.value.file_uuid || currentRow.value.uuid
      )
    );

    removeTrashedFileFromList(restoredFile.data.file_uuid || restoredFile.data.uuid);
    message.success($i18n.t('form.success.restored.file'));

    /** Remove timestamp for items */
    sessionStorage.removeItem(LsCacheKeys.BUCKET_ITEMS);
  } catch (error) {
    window.$message.error(userFriendlyMsg(error));
  }
  bucketStore.loading = false;
}

function removeTrashedFileFromList(uuid: string) {
  fileStore.trash.items = fileStore.trash.items.filter(
    item => item.file_uuid !== uuid && item.uuid !== uuid
  );
}
</script>
