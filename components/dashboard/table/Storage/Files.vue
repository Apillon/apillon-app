<template>
  <div class="pb-8">
    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      v-model:checked-row-keys="checkedRowKeys"
      remote
      :bordered="false"
      :columns="columns"
      :data="bucketStore.folder.items"
      :loading="bucketStore.folder.loading"
      :pagination="pagination"
      :row-key="rowKey"
      :row-props="rowProps"
      @update:checked-row-keys="handleCheck"
      @update:page="handlePageChange"
      @update:sorter="handleSorterChange"
    />

    <!-- Drawer - File details -->
    <n-drawer v-model:show="drawerFileDetailsVisible" :width="495">
      <n-drawer-content v-if="drawerFileDetailsVisible" :title="currentRow.name" closable>
        <StorageFileDetails :file="currentRow" @on-file-delete="deleteBucketItems" />
      </n-drawer-content>
    </n-drawer>

    <!-- Modal - Delete file/folder -->
    <ModalDelete
      v-model:show="showModalDelete"
      :title="
        $i18n.te(`storage.${currentRowType}.delete`)
          ? $t(`storage.${currentRowType}.delete`)
          : $t(`storage.delete.item`)
      "
    >
      <template #content>
        <p class="text-body">
          {{ $t(`storage.${currentRowType}.deleteConfirm`, { num: 1 }) }}
        </p>
      </template>
      <slot>
        <FormDeleteItems :items="[currentRow]" @submit-success="onBucketItemsDeleted" />
      </slot>
    </ModalDelete>

    <!-- Modal - Publish IPNS -->
    <modal v-model:show="modalIpnsPublishVisible" :title="$t('storage.ipns.publish')">
      <FormStorageIpnsPublish
        :cid="currentRow?.CID || ''"
        @submit-success="modalIpnsPublishVisible = false"
      />
    </modal>

    <!-- W3Warn: delete bucket -->
    <W3Warn v-model:show="showModalW3Warn" @submit="onModalW3WarnHide">
      {{ $t('w3Warn.file.delete') }}
    </W3Warn>
  </div>
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
import { NButton, NDropdown, NEllipsis, NSpace, NTooltip, useMessage } from 'naive-ui';

const props = defineProps({
  type: {
    type: Number,
    validator: (type: number) =>
      [
        TableFilesType.BUCKET,
        TableFilesType.HOSTING,
        TableFilesType.NFT_METADATA,
        TableFilesType.DEPLOYMENT,
      ].includes(type),
    default: 0,
  },
});

const { downloadFile } = useFile();
const $i18n = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const showModalW3Warn = ref<boolean>(false);
const showModalDelete = ref<boolean | null>(false);
const drawerFileDetailsVisible = ref<boolean>(false);
const modalIpnsPublishVisible = ref<boolean>(false);
const tableRef = ref<NDataTableInst | null>(null);
const TableColumns = resolveComponent('TableColumns');
const IconFolderFile = resolveComponent('IconFolderFile');
const TableEllipsis = resolveComponent('TableEllipsis');
const TableLink = resolveComponent('TableLink');
const StorageFileStatus = resolveComponent('StorageFileStatus');

/** Polling */
let fileInterval: any = null as any;

const currentRow = ref<BucketItemInterface>({} as BucketItemInterface);
const checkedRowKeys = ref<Array<string | number>>([]);

/** Current row type */
const currentRowType = computed<string>(() => {
  return currentRow.value.type === BucketItemType.DIRECTORY ? 'directory' : 'file';
});

/** Pagination data */
const currentPage = ref<number>(1);
const pagination = computed(() => {
  return {
    page: currentPage.value,
    pageSize: PAGINATION_LIMIT,
    pageCount: Math.ceil(bucketStore.folder.total / PAGINATION_LIMIT),
    itemCount: bucketStore.folder.total,
  };
});

/** Dropdown options for folder and file */
const dropdownOptions = (bucketItem: BucketItemInterface) => {
  return [
    {
      key: 'view',
      label: $i18n.t('general.view'),
      show: bucketItem.type === BucketItemType.FILE && props.type === TableFilesType.BUCKET,
      props: {
        onClick: () => {
          onFileOpen();
        },
      },
    },
    {
      key: 'open',
      label: $i18n.t('general.open'),
      show: bucketItem.type === BucketItemType.DIRECTORY,
      props: {
        onClick: () => {
          onFolderOpen(currentRow.value);
        },
      },
    },
    {
      key: 'download',
      label: $i18n.t('general.download'),
      show: bucketItem.type === BucketItemType.FILE && props.type === TableFilesType.BUCKET,
      props: {
        onClick: () => {
          downloadFile(currentRow.value);
        },
      },
    },
    {
      key: 'ipns',
      label: $i18n.t('storage.ipns.publish'),
      disabled: !bucketItem.CID || authStore.isAdmin(),
      show: props.type === TableFilesType.BUCKET || props.type === TableFilesType.NFT_METADATA,
      props: {
        onClick: () => {
          if (bucketItem.CID) {
            modalIpnsPublishVisible.value = true;
          }
        },
      },
    },
    {
      key: 'delete',
      label: $i18n.t('general.delete'),
      disabled: authStore.isAdmin(),
      props: {
        class: '!text-pink',
        onClick: () => {
          showModalDelete.value = true;
        },
      },
    },
  ];
};

function renderOption({ node, option }: DropdownRenderOption) {
  if (option.key === 'ipns' && option.disabled) {
    return h(
      NTooltip,
      { keepAliveOnHover: false, style: { width: 'max-content' } },
      {
        trigger: () => [node],
        default: () => $i18n.t('storage.ipns.disabled'),
      }
    );
  }
  return [node];
}

/** Available columns - show/hide column */
const selectedColumns = ref([
  'name',
  'CID',
  'link',
  'size',
  'createTime',
  'contentType',
  'fileStatus',
]);
const availableColumns = ref([
  { value: 'name', label: $i18n.t('storage.fileName') },
  { value: 'CID', label: $i18n.t('storage.fileCid'), hidden: props.type !== TableFilesType.BUCKET },
  {
    value: 'link',
    label: $i18n.t('storage.downloadLink'),
    hidden: props.type !== TableFilesType.BUCKET,
  },
  { value: 'size', label: $i18n.t('storage.fileSize') },
  { value: 'createTime', label: $i18n.t('dashboard.created') },
  { value: 'contentType', label: $i18n.t('storage.contentType') },
  { value: 'fileStatus', label: $i18n.t('storage.fileStatusName') },
]);

/** Columns */
const columns = computed(() => {
  return [
    {
      type: 'selection',
      className: { hidden: props.type === TableFilesType.DEPLOYMENT },
    },
    {
      title: $i18n.t('storage.fileName'),
      key: 'name',
      className: [ON_COLUMN_CLICK_OPEN_CLASS, { hidden: !selectedColumns.value.includes('name') }],
      sorter: props.type === TableFilesType.DEPLOYMENT ? false : 'default',
      minWidth: 200,
      render(row: BucketItemInterface) {
        return [
          h(
            NSpace,
            { align: 'center', wrap: false, class: cellClasses(row.type) },
            {
              default: () => [
                h(IconFolderFile, { isFile: row.type === BucketItemType.FILE }, ''),
                h(
                  NEllipsis,
                  { class: 'text-blue align-bottom min-w-[120px]', 'line-clamp': 2 },
                  { default: () => row.name }
                ),
              ],
            }
          ),
        ];
      },
    },
    {
      title: $i18n.t('storage.fileCid'),
      key: 'CID',
      className: {
        hidden:
          !selectedColumns.value.includes('CID') ||
          props.type === TableFilesType.HOSTING ||
          props.type === TableFilesType.DEPLOYMENT,
      },
      sorter: props.type === TableFilesType.DEPLOYMENT ? false : 'default',
      render(row: BucketItemInterface) {
        return h(TableEllipsis, { text: row.CID }, '');
      },
    },
    {
      title: $i18n.t('storage.downloadLink'),
      key: 'link',
      className: {
        hidden:
          !selectedColumns.value.includes('link') ||
          props.type === TableFilesType.HOSTING ||
          props.type === TableFilesType.DEPLOYMENT,
      },
      sorter: props.type === TableFilesType.DEPLOYMENT ? false : 'default',
      render(row: BucketItemInterface) {
        return h(TableLink, { link: row.link }, '');
      },
    },
    {
      title: $i18n.t('storage.fileSize'),
      key: 'size',
      className: [ON_COLUMN_CLICK_OPEN_CLASS, { hidden: !selectedColumns.value.includes('size') }],
      sorter: props.type === TableFilesType.DEPLOYMENT ? false : 'default',
      render(row: BucketItemInterface) {
        if (row.size) {
          return h(
            'span',
            { class: cellClasses(row.type) },
            { default: () => formatBytes(row.size || 0) }
          );
        }
        return '';
      },
    },
    {
      title: $i18n.t('dashboard.created'),
      key: 'createTime',
      className: [
        ON_COLUMN_CLICK_OPEN_CLASS,
        { hidden: !selectedColumns.value.includes('createTime') },
      ],
      sorter: props.type === TableFilesType.DEPLOYMENT ? false : 'default',
      render(row: BucketItemInterface) {
        return h(
          'span',
          { class: cellClasses(row.type) },
          { default: () => datetimeToDate(row.createTime || '') }
        );
      },
    },
    {
      key: 'contentType',
      title: $i18n.t('storage.contentType'),
      className: [
        ON_COLUMN_CLICK_OPEN_CLASS,
        { hidden: !selectedColumns.value.includes('contentType') },
      ],
      sorter: props.type === TableFilesType.DEPLOYMENT ? false : 'default',
      render(row: BucketItemInterface) {
        if (row.contentType) {
          return h('span', { class: cellClasses(row.type) }, row.contentType);
        }
        return '';
      },
    },
    {
      key: 'fileStatus',
      title: $i18n.t('general.status'),
      className: [
        ON_COLUMN_CLICK_OPEN_CLASS,
        { hidden: !selectedColumns.value.includes('fileStatus') },
      ],
      sorter: props.type === TableFilesType.DEPLOYMENT ? false : 'default',
      render(row: BucketItemInterface) {
        if (!row.fileStatus) {
          return '';
        } else if (
          props.type === TableFilesType.HOSTING &&
          row.fileStatus === FileStatus.UPLOADED_TO_S3
        ) {
          return h(StorageFileStatus, { fileStatus: FileStatus.UPLOAD_COMPLETED }, '');
        } else {
          return h(StorageFileStatus, { fileStatus: row.fileStatus }, '');
        }
      },
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      className: ['!py-0', { hidden: props.type === TableFilesType.DEPLOYMENT }],
      render(row: BucketItemInterface) {
        return h(
          NDropdown,
          {
            options: dropdownOptions(row),
            renderOption,
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
    {
      key: 'columns',
      filter: 'default',
      filterOptionValue: null,
      className: { hidden: props.type === TableFilesType.DEPLOYMENT },
      renderFilterIcon: () => {
        return h('span', { class: 'icon-more' }, '');
      },
      renderFilterMenu: () => {
        return h(
          TableColumns,
          {
            model: selectedColumns.value,
            columns: availableColumns.value,
            onColumnChange: handleColumnChange,
          },
          ''
        );
      },
    },
  ];
});

const rowKey = (row: BucketItemInterface) => row.uuid;
const handleCheck = (rowKeys: Array<NDataTableRowKey>) => {
  checkedRowKeys.value = rowKeys;

  bucketStore.folder.selectedItems = bucketStore.folder.items.filter(item =>
    rowKeys.includes(item.uuid)
  );
};

function handleColumnChange(selectedValues: Array<string>) {
  selectedColumns.value = selectedValues;
  localStorage.setItem(LsTableColumnsKeys.FILES, JSON.stringify(selectedColumns.value));
}

function rowProps(row: BucketItemInterface) {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        onItemOpen(row);
      }
    },
  };
}

/** Action when user click on File/Folder name */
function onItemOpen(row: BucketItemInterface) {
  currentRow.value = row;
  switch (row.type) {
    case BucketItemType.FILE:
      if (props.type !== TableFilesType.HOSTING) {
        onFileOpen();
      }
      break;
    case BucketItemType.DIRECTORY:
      onFolderOpen(row);
      break;
    default:
      console.warn("Unknown item type: it should be of type 'file' or 'directory'!");
  }
}

/** Show file details if actions are enabled */
function onFileOpen() {
  if (
    currentRow.value.type === BucketItemType.FILE &&
    (currentRow.value?.fileStatus || 0) > FileStatus.UPLOADED_TO_S3
  ) {
    drawerFileDetailsVisible.value = true;
  } else {
    message.warning($i18n.t('storage.file.stillUploading'));
  }
}

/** Open directory - show subfolder content */
async function onFolderOpen(folder: BucketItemInterface) {
  /** Add subfolder to folder path */
  bucketStore.folder.path.push({
    id: folder.uuid,
    name: folder.name,
  });

  /** Fetch data in reset search string */
  bucketStore.folderSearch();
  await getDirectoryContent(bucketStore.bucketUuid, folder.uuid);
  clearSorter();
}

onMounted(() => {
  /** Check if selected columns are stored in LS */
  if (localStorage.getItem(LsTableColumnsKeys.FILES)) {
    selectedColumns.value = JSON.parse(localStorage.getItem(LsTableColumnsKeys.FILES) || '');
  }

  /**
   * Load data on mounted
   */
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await bucketStore.getDirectoryContent();
      checkUnfinishedFiles();
    });
  }, 100);
});
onUnmounted(() => {
  clearInterval(fileInterval);
});

/** Sort column - fetch directory content with order params  */
async function handleSorterChange(sorter?: NDataTableSortState) {
  if (sorter && sorter.order === false) {
    await getDirectoryContent();
  } else if (sorter) {
    await getDirectoryContent(
      bucketStore.bucketUuid,
      bucketStore.folder.selected,
      1,
      `${sorter.columnKey}`,
      `${sorter.order}`
    );
  }
}

/** Reset sort if user search change directory or search directory content */
function clearSorter() {
  if (tableRef.value) {
    tableRef.value.sort(0, false);
  }
}

/** Watch folder path, onChange clear sorter */
watch(
  () => bucketStore.folder.path,
  _ => {
    clearSorter();
  }
);

/** On page change, load data */
async function handlePageChange(currentPage: number) {
  if (!bucketStore.folder.loading) {
    await getDirectoryContent(bucketStore.bucketUuid, bucketStore.folder.selected, currentPage);
  }
}

/**
 * On deleteBucketItems click
 * If W3Warn has already been shown, show modal delete items, otherwise show warn first
 * */
function deleteBucketItems() {
  if (localStorage.getItem(LsW3WarnKeys.BUCKET_ITEM_DELETE)) {
    showModalDelete.value = true;
  } else {
    showModalW3Warn.value = true;
    showModalDelete.value = null;
  }
}

/** When user close W3Warn, allow him to create new bucket */
function onModalW3WarnHide() {
  if (showModalDelete.value !== false) {
    showModalDelete.value = true;
  }
}

/** Watch showModalW3Warn, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      localStorage.setItem(LsW3WarnKeys.BUCKET_ITEM_DELETE, Date.now().toString());
    }
  }
);

/**
 * On folder/file deleted
 * Hide modal and refresh folder list
 * */
function onBucketItemsDeleted() {
  showModalDelete.value = false;
  drawerFileDetailsVisible.value = false;

  /** Reset selected items */
  handleCheck([]);

  setTimeout(() => {
    getDirectoryContent();
  }, 300);
}

/** Search folders and files */
watch(
  () => bucketStore.folder.search,
  _ => {
    if (bucketStore.folder.allowFetch) {
      debouncedSearchFilter();
      clearSorter();
    }
  }
);
const debouncedSearchFilter = debounce(getDirectoryContent, 500);

/** Function "Fetch directory content" wrapper  */
async function getDirectoryContent(
  bucketUuid?: string,
  folderUuid?: string,
  page = 1,
  orderBy?: string,
  order?: string
) {
  clearInterval(fileInterval);

  await bucketStore.fetchDirectoryContent({
    bucketUuid,
    folderUuid,
    page,
    limit: PAGINATION_LIMIT,
    search: bucketStore.folder.search,
    orderBy,
    order,
  });

  checkUnfinishedFiles();
  currentPage.value = page;
}

/** Files polling */
function checkUnfinishedFiles() {
  if (!hasUnfinishedFiles()) {
    return;
  }

  fileInterval = setInterval(async () => {
    await bucketStore.fetchDirectoryContent({ loader: false });
    if (!hasUnfinishedFiles()) {
      clearInterval(fileInterval);
    }
  }, 30000);
}
function hasUnfinishedFiles(): boolean {
  return bucketStore.folder.items.some(
    file => file.fileStatus && file.fileStatus < FileStatus.UPLOADED_TO_IPFS
  );
}

/** Additional classes if TableType is Hosting and RowType is File  */
function cellClasses(rowType: number) {
  return props.type === TableFilesType.HOSTING && rowType === BucketItemType.FILE
    ? 'p-3 -m-3 cursor-default'
    : '';
}
</script>
