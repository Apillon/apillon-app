<template>
  <n-data-table
    remote
    ref="tableRef"
    :bordered="false"
    :columns="columns"
    :data="dataStore.folder.items"
    :loading="dataStore.folder.loading"
    :pagination="pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:checked-row-keys="handleCheck"
    @update:page="handlePageChange"
    @update:sorter="handleSorterChange"
  />

  <!-- Drawer - File details -->
  <n-drawer v-model:show="drawerFileDetailsVisible" :width="495">
    <n-drawer-content v-if="drawerFileDetailsVisible">
      <StorageFileDetails v-if="currentRow.CID" :file-cid="currentRow.CID" />
    </n-drawer-content>
  </n-drawer>

  <!-- Modal - Delete file/folder -->
  <modal
    v-model:show="showModalDelete"
    :title="
      $i18n.te(`storage.${currentRow.type}.delete`)
        ? $t(`storage.${currentRow.type}.delete`)
        : $t(`general.delete`)
    "
  >
    <FormStorageFolderDelete :items="[currentRow]" @submit-success="onDeleted" />
  </modal>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash';
import { NButton, NDropdown, NEllipsis, NSpace } from 'naive-ui';

const $i18n = useI18n();
const dataStore = useDataStore();
const showModalDelete = ref<boolean>(false);
const drawerFileDetailsVisible = ref<boolean>(false);
const tableRef = ref<NDataTableInst | null>(null);
const TableColumns = resolveComponent('TableColumns');
const IconFolderFile = resolveComponent('IconFolderFile');

const currentRow = ref<FolderInterface>({} as FolderInterface);

/** Pagination data */
const currentPage = ref<number>(0);
const pagination = computed(() => {
  return {
    page: currentPage.value,
    pageSize: PAGINATION_LIMIT,
    pageCount: Math.ceil(dataStore.folder.total / PAGINATION_LIMIT),
    itemCount: dataStore.folder.total,
  };
});

/** Dropdown options for folder and file */
const dropdownFolderOptions = [
  {
    label: $i18n.t('general.open'),
    key: 'open',
    props: {
      onClick: async () => {
        onFolderOpen(currentRow.value);
      },
    },
  },
  {
    label: $i18n.t('general.delete'),
    key: 'delete',
    props: {
      onClick: () => {
        showModalDelete.value = true;
      },
    },
  },
];

const dropdownFileOptions = [
  {
    label: $i18n.t('general.view'),
    key: 'view',
    props: {
      onClick: () => {
        drawerFileDetailsVisible.value = true;
      },
    },
  },
  {
    label: $i18n.t('general.download'),
    key: 'download',
    props: {
      onClick: () => {
        downloadFile(currentRow.value.CID);
      },
    },
  },
  {
    label: $i18n.t('general.delete'),
    key: 'delete',
    props: {
      onClick: () => {
        showModalDelete.value = true;
      },
    },
  },
];

/** Available columns - show/hide column */
const selectedColumns = ref(['name', 'CID', 'link', 'size', 'createTime', 'contentType']);
const availableColumns = ref([
  { value: 'name', label: $i18n.t('storage.fileName') },
  { value: 'CID', label: $i18n.t('storage.fileCid') },
  { value: 'link', label: $i18n.t('storage.downloadLink') },
  { value: 'size', label: $i18n.t('storage.fileSize') },
  { value: 'createTime', label: $i18n.t('dashboard.created') },
  { value: 'contentType', label: $i18n.t('storage.contentType') },
]);

/** Columns */
const columns = computed(() => {
  return [
    {
      type: 'selection',
    },
    {
      title: $i18n.t('storage.fileName'),
      key: 'name',
      className: [
        ON_COLUMN_CLICK_OPEN_CLASS,
        selectedColumns.value.includes('name') ? '' : 'hidden',
      ],
      sorter: 'default',
      minWidth: 150,
      render(row: FolderInterface) {
        return [
          h(
            NSpace,
            { align: 'center', wrap: false },
            {
              default: () => [
                h(IconFolderFile, { isFile: row.type === BucketItemType.FILE }, ''),
                h(
                  NEllipsis,
                  { class: 'text-blue align-bottom', 'line-clamp': 2 },
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
      className: selectedColumns.value.includes('CID') ? '' : 'hidden',
      sorter: 'default',
      render(row: FolderInterface) {
        if (row.CID) {
          return [
            h(
              'div',
              { class: 'flex' },
              {
                default: () => [
                  h(
                    'span',
                    { class: 'text-grey whitespace-nowrap' },
                    { default: () => truncateCid(row.CID || '') }
                  ),
                  h(
                    'button',
                    { class: 'ml-2', onClick: () => copyToClipboard(row.CID || '') },
                    h('span', { class: 'icon-copy text-grey' }, {})
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
      title: $i18n.t('storage.downloadLink'),
      key: 'link',
      className: selectedColumns.value.includes('link') ? '' : 'hidden',
      sorter: 'default',
      render(row: FolderInterface) {
        if (row.CID) {
          return [
            h(
              'div',
              { class: 'flex' },
              {
                default: () => [
                  h(
                    NEllipsis,
                    { class: 'text-grey align-bottom', 'line-clamp': 1 },
                    { default: () => row.link }
                  ),
                  h(
                    'button',
                    { class: 'ml-2', onClick: () => copyToClipboard(row.link) },
                    h('span', { class: 'icon-copy text-grey' }, {})
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
      title: $i18n.t('storage.fileSize'),
      key: 'size',
      className: [
        ON_COLUMN_CLICK_OPEN_CLASS,
        selectedColumns.value.includes('size') ? '' : 'hidden',
      ],
      sorter: 'default',
      render(row: FolderInterface) {
        if (row.size) {
          return h('span', {}, { default: () => formatBytes(row.size || 0) });
        }
        return '';
      },
    },
    {
      title: $i18n.t('dashboard.created'),
      key: 'createTime',
      className: [
        ON_COLUMN_CLICK_OPEN_CLASS,
        selectedColumns.value.includes('createTime') ? '' : 'hidden',
      ],
      sorter: 'default',
      render(row: FolderInterface) {
        return h('span', {}, { default: () => datetimeToDate(row.createTime || '') });
      },
    },
    {
      title: $i18n.t('storage.contentType'),
      key: 'contentType',
      className: [
        ON_COLUMN_CLICK_OPEN_CLASS,
        selectedColumns.value.includes('contentType') ? '' : 'hidden',
      ],
      sorter: 'default',
      render(row: FolderInterface) {
        if (row.contentType) {
          return h('span', {}, row.contentType);
        }
        return '';
      },
    },
    {
      title: $i18n.t('general.actions'),
      key: 'actions',
      align: 'right',
      className: '!py-0',
      render(row: FolderInterface) {
        return h(
          NDropdown,
          {
            options: row.type === BucketItemType.FILE ? dropdownFileOptions : dropdownFolderOptions,
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
    {
      key: 'columns',
      filter: 'default',
      filterOptionValue: null,
      renderFilterIcon: () => {
        return h('span', { class: 'icon-more' }, '');
      },
      renderFilterMenu: ({ hide }) => {
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

const rowKey = (row: FolderInterface) => row.id;

const handleCheck = (rowKeys: Array<DataTableRowKey>) => {
  const rowKeyIds = rowKeys.map(item => intVal(item));

  dataStore.folder.selectedItems = dataStore.folder.items.filter(item =>
    rowKeyIds.includes(item.id)
  );
};

function handleColumnChange(selectedValues: Array<string>) {
  selectedColumns.value = selectedValues;
  localStorage.setItem(LsTableColumnsKeys.FILES, JSON.stringify(selectedColumns.value));
}

function rowProps(row: FolderInterface) {
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
async function onItemOpen(row: FolderInterface) {
  currentRow.value = row;
  switch (row.type) {
    case 'file':
      drawerFileDetailsVisible.value = true;
      break;
    case 'directory':
      onFolderOpen(row);
      break;
    default:
      console.warn("Unknown item type: it should be of type 'file' or 'directory'!");
  }
}

/** Open directory - show subfolder content */
async function onFolderOpen(folder: FolderInterface) {
  /** Add subfolder to folder path */
  dataStore.folder.path.push({
    id: folder.id,
    name: folder.name,
  });

  /** Fetch data in reset search string */
  dataStore.folderSearch();
  await getDirectoryContent(dataStore.currentBucket.bucket_uuid, folder.id);
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
      await getDirectoryContent();
    });
  }, 100);
});

/** Sort column - fetch directory content with order params  */
async function handleSorterChange(sorter?: NDataTableSortState) {
  if (sorter && sorter.order === false) {
    await getDirectoryContent();
  } else if (sorter) {
    await getDirectoryContent(
      dataStore.currentBucket.bucket_uuid,
      dataStore.folder.selected,
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

/** Watch folder path, onCahnge clear sorter */
watch(
  () => dataStore.folder.path,
  _ => {
    clearSorter();
  }
);

/** On page change, load data */
async function handlePageChange(currentPage: number) {
  if (!dataStore.folder.loading) {
    await getDirectoryContent(
      dataStore.currentBucket.bucket_uuid,
      dataStore.folder.selected,
      currentPage
    );
  }
}

/** On folder deleted, refresh folder list */
async function onDeleted() {
  await getDirectoryContent();
  showModalDelete.value = false;
}

/** Search folders and files */
watch(
  () => dataStore.folder.search,
  _ => {
    if (dataStore.folder.allowFetch) {
      debouncedSearchFilter();
      clearSorter();
    }
  }
);
const debouncedSearchFilter = debounce(getDirectoryContent, 500);

/** Function "Fetch directory content" wrapper  */
async function getDirectoryContent(
  bucketUuid?: string,
  folderId?: number,
  page: number = 1,
  orderBy?: string,
  order?: string
) {
  await dataStore.fetchDirectoryContent(
    bucketUuid,
    folderId,
    page,
    PAGINATION_LIMIT,
    dataStore.folder.search,
    orderBy,
    order
  );

  currentPage.value = page;
}

/** Download file - get file details and download content from downloadLink */
async function downloadFile(CID?: string | null) {
  if (!CID) {
    console.warn('MISSING File CID!');
    return;
  }
  if (!(CID in dataStore.file.items)) {
    dataStore.file.items[CID] = await dataStore.fetchFileDetails(CID);
  }
  const fileDetails: FileDetails = dataStore.file.items[CID].file;
  download(fileDetails.downloadLink, fileDetails.name);
}
</script>
