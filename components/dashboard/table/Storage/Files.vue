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

    <!-- W3Warn: delete bucket -->
    <W3Warn v-model:show="showModalW3Warn" @update:show="onModalW3WarnHide">
      {{ $t('w3Warn.file.delete') }}
    </W3Warn>
  </div>
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
import { NButton, NDropdown, NEllipsis, NSpace } from 'naive-ui';

const props = defineProps({
  actions: { type: Boolean, default: true },
});

const { downloadFile } = useFile();
const $i18n = useI18n();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const showModalW3Warn = ref<boolean>(false);
const showModalDelete = ref<boolean | null>(false);
const drawerFileDetailsVisible = ref<boolean>(false);
const tableRef = ref<NDataTableInst | null>(null);
const TableColumns = resolveComponent('TableColumns');
const IconFolderFile = resolveComponent('IconFolderFile');

const currentRow = ref<BucketItemInterface>({} as BucketItemInterface);
const checkedRowKeys = ref<Array<string | number>>([]);

/** Current row type */
const currentRowType = computed<string>(() => {
  return currentRow.value.type === BucketItemType.DIRECTORY ? 'directory' : 'file';
});

/** Pagination data */
const currentPage = ref<number>(0);
const pagination = computed(() => {
  return {
    page: currentPage.value,
    pageSize: PAGINATION_LIMIT,
    pageCount: Math.ceil(bucketStore.folder.total / PAGINATION_LIMIT),
    itemCount: bucketStore.folder.total,
  };
});

/** Dropdown options for folder and file */
const dropdownFolderOptions = [
  {
    label: $i18n.t('general.open'),
    key: 'open',
    props: {
      onClick: () => {
        onFolderOpen(currentRow.value);
      },
    },
  },
  {
    label: $i18n.t('general.delete'),
    key: 'delete',
    props: {
      class: '!text-pink',
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
      class: '!text-pink',
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
      className: { hidden: props.actions === false },
    },
    {
      title: $i18n.t('storage.fileName'),
      key: 'name',
      className: [ON_COLUMN_CLICK_OPEN_CLASS, { hidden: !selectedColumns.value.includes('name') }],
      sorter: props.actions ? 'default' : false,
      minWidth: 200,
      render(row: BucketItemInterface) {
        return [
          h(
            NSpace,
            { align: 'center', wrap: false },
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
      className: { hidden: !selectedColumns.value.includes('CID') },
      sorter: props.actions ? 'default' : false,
      render(row: BucketItemInterface) {
        if (row.CID) {
          return [
            h(
              'div',
              { class: 'flex' },
              {
                default: () => [
                  h(
                    'span',
                    { class: 'text-body whitespace-nowrap' },
                    { default: () => truncateCid(row.CID || '') }
                  ),
                  h(
                    'button',
                    { class: 'ml-2', onClick: () => copyToClipboard(row.CID || '') },
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
      title: $i18n.t('storage.downloadLink'),
      key: 'link',
      className: { hidden: !selectedColumns.value.includes('link') },
      sorter: props.actions ? 'default' : false,
      render(row: BucketItemInterface) {
        if (row.CID) {
          return [
            h(
              'div',
              { class: 'flex' },
              {
                default: () => [
                  h(
                    'a',
                    { href: row.link, target: '_blank' },
                    h(
                      NEllipsis,
                      { class: 'text-body align-bottom', 'line-clamp': 1 },
                      { default: () => row.link }
                    )
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
      title: $i18n.t('storage.fileSize'),
      key: 'size',
      className: [ON_COLUMN_CLICK_OPEN_CLASS, { hidden: !selectedColumns.value.includes('size') }],
      sorter: props.actions ? 'default' : false,
      render(row: BucketItemInterface) {
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
        { hidden: !selectedColumns.value.includes('createTime') },
      ],
      sorter: props.actions ? 'default' : false,
      render(row: BucketItemInterface) {
        return h('span', {}, { default: () => datetimeToDate(row.createTime || '') });
      },
    },
    {
      title: $i18n.t('storage.contentType'),
      key: 'contentType',
      className: [
        ON_COLUMN_CLICK_OPEN_CLASS,
        { hidden: !selectedColumns.value.includes('contentType') },
      ],
      sorter: props.actions ? 'default' : false,
      render(row: BucketItemInterface) {
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
      className: ['!py-0', { hidden: props.actions === false }],
      render(row: BucketItemInterface) {
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
      className: { hidden: props.actions === false },
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

const rowKey = (row: BucketItemInterface) => row.id;

const handleCheck = (rowKeys: Array<NDataTableRowKey>) => {
  checkedRowKeys.value = rowKeys;
  const rowKeyIds = rowKeys.map(item => intVal(item));

  bucketStore.folder.selectedItems = bucketStore.folder.items.filter(item =>
    rowKeyIds.includes(item.id)
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
      onFileOpen();
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
  if (props.actions) {
    drawerFileDetailsVisible.value = true;
  }
}

/** Open directory - show subfolder content */
async function onFolderOpen(folder: BucketItemInterface) {
  /** Add subfolder to folder path */
  bucketStore.folder.path.push({
    id: folder.id,
    name: folder.name,
  });

  /** Fetch data in reset search string */
  bucketStore.folderSearch();
  await getDirectoryContent(bucketStore.bucketUuid, folder.id);
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
    Promise.all(Object.values(dataStore.promises)).then(_ => {
      bucketStore.getDirectoryContent();
    });
  }, 100);
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

/** Watch folder path, onCahnge clear sorter */
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
  if (sessionStorage.getItem(LsW3WarnKeys.BUCKET_ITEM_DELETE)) {
    showModalDelete.value = true;
  } else {
    showModalW3Warn.value = true;
    showModalDelete.value = null;
  }
}

/** When user close W3Warn, allow him to create new bucket */
function onModalW3WarnHide(value: boolean) {
  if (!value && showModalDelete.value !== false) {
    showModalDelete.value = true;
  }
}

/** Watch showModalW3Warn, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      sessionStorage.setItem(LsW3WarnKeys.BUCKET_ITEM_DELETE, Date.now().toString());
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
  folderId?: number,
  page: number = 1,
  orderBy?: string,
  order?: string
) {
  await bucketStore.fetchDirectoryContent(
    bucketUuid,
    folderId,
    page,
    PAGINATION_LIMIT,
    bucketStore.folder.search,
    orderBy,
    order
  );

  currentPage.value = page;
}
</script>
