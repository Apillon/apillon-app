<template>
  <n-space class="pb-8" :size="12" vertical>
    <n-space justify="space-between">
      <div class="w-[45vw] max-w-xs sm:w-[30vw] lg:w-[20vw]">
        <FormFieldSearch v-model:value="fileStore.trash.search" :placeholder="$t('storage.file.search')" />
      </div>

      <n-space size="large">
        <!-- Refresh files -->
        <n-button :loading="fileStore.trash.loading" @click="fileStore.fetchDeletedFiles()">
          <span class="icon-refresh mr-2 text-xl"></span>
          {{ $t('general.refresh') }}
        </n-button>
      </n-space>
    </n-space>
    <DataTable
      ref="tableRef"
      :bordered="false"
      :columns="columns"
      :data="fileStore.trash.items"
      :loading="fileStore.trash.loading"
      :pagination="fileStore.trash.pagination"
      :row-props="rowProps"
      remote
      @update:page="(page: number) => handlePageChange(page, fileStore.trash.pagination.pageSize)"
      @update:sorter="handleSorterChange"
    />
  </n-space>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import type { DataTableSortState, DataTableInst } from 'naive-ui';
import { NDropdown, NEllipsis, useMessage } from 'naive-ui';

const { t } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const fileStore = useFileStore();
const bucketStore = useBucketStore();
const { tableRowCreateTime, tableRowUpdateTime } = useTable();

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
      title: t('storage.fileName'),
      render(row) {
        return [h(resolveComponent('IconFolderFile'), { isFile: true }, ''), h('span', { class: 'ml-2 ' }, row.name)];
      },
    },
    {
      key: 'CID',
      sorter: 'default',
      title: t('storage.fileCid'),
      render(row) {
        return h(resolveComponent('TableEllipsis'), { text: row.CID }, '');
      },
    },
    {
      key: 'link',
      title: t('storage.downloadLink'),
      render(row: BucketItemInterface) {
        if (row.CID) {
          return [
            h(
              'div',
              { class: 'flex' },
              {
                default: () => [
                  h(NEllipsis, { class: 'text-body align-bottom', 'line-clamp': 1 }, { default: () => row.link }),
                  h(
                    'button',
                    { class: 'ml-2', onClick: () => copyToClipboard(row.link || '') },
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
      title: t('storage.fileSize'),
      render(row: BucketItemInterface) {
        if (row.size) {
          return h('span', {}, { default: () => formatBytes(row.size || 0) });
        }
        return '';
      },
    },
    {
      ...tableRowCreateTime,
      sorter: 'default',
    },
    {
      ...tableRowUpdateTime,
      sorter: 'default',
      title: t('dashboard.deletedAt'),
    },
    {
      key: 'contentType',
      sorter: 'default',
      title: t('storage.contentType'),
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
      className: '!py-0 !sticky right-0',
      render() {
        return h(
          NDropdown,
          {
            options: dropdownOptions,
            trigger: 'click',
          },
          {
            default: () => h(resolveComponent('BtnActions')),
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
    label: t('general.restore'),
    disabled: authStore.isAdmin(),
    props: {
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
    getDeletedFiles(1);
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
const debouncedSearchFilter = useDebounceFn(getDeletedFiles, 500);

/** On page change, load data */
async function handlePageChange(currentPage: number, pageSize?: number) {
  if (!fileStore.trash.loading) {
    await getDeletedFiles(currentPage, pageSize);
  }
}

async function getDeletedFiles(page = 1, limit: number = PAGINATION_LIMIT) {
  fileStore.trash.pagination.page = page;

  await fileStore.fetchDeletedFiles({
    page,
    limit,
    search: fileStore.trash.search,
    orderBy: sort.value ? `${sort.value.columnKey}` : undefined,
    order: sort.value ? `${sort.value.order}` : undefined,
  });
  fileStore.trash.pagination.page = page;
  fileStore.trash.pagination.pageSize = limit;
}

/**
 * Restore file
 * */
async function restore() {
  bucketStore.loading = true;

  try {
    const restoredFile = await $api.patch<BucketItemResponse>(
      endpoints.storageFileRestore(bucketStore.bucketUuid, currentRow.value.file_uuid || currentRow.value.uuid)
    );

    removeTrashedFileFromList(restoredFile.data.file_uuid || restoredFile.data.uuid);
    message.success(t('form.success.restored.file'));

    /** Remove timestamp for items */
    sessionStorage.removeItem(LsCacheKeys.BUCKET_ITEMS);
  } catch (error) {
    window.$message.error(userFriendlyMsg(error));
  }
  bucketStore.loading = false;
}

function removeTrashedFileFromList(uuid: string) {
  fileStore.trash.items = fileStore.trash.items.filter(item => item.file_uuid !== uuid && item.uuid !== uuid);
}
</script>
