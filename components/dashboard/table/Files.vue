<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="dataStore.folder.items"
    :loading="dataStore.folder.loading"
    :pagination="pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:checked-row-keys="handleCheck"
    @update:page="handlePageChange"
  />

  <!-- Drawer - File details -->
  <n-drawer v-model:show="drawerFileDetailsVisible" :width="495">
    <n-drawer-content v-if="drawerFileDetailsVisible">
      <StorageFileDetails v-if="currentRow.CID" :file-cid="currentRow.CID" />
    </n-drawer-content>
  </n-drawer>

  <!-- Modal - Delete file/folder -->
  <modal v-model:show="showModalDelete" :title="$t(`storage.${currentRow.type}.delete`)">
    <FormStorageFolderDelete
      :id="currentRow.id"
      :type="currentRow.type"
      @submit-success="onDeleted"
    />
  </modal>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash';
import { DataTableColumns, DataTableRowKey, NButton, NDropdown, NTag } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const dataStore = useDataStore();
const showModalDelete = ref<boolean>(false);
const drawerFileDetailsVisible = ref<boolean>(false);
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
    label: $i18n.t('general.delete'),
    key: 'delete',
    props: {
      onClick: () => {
        showModalDelete.value = true;
      },
    },
  },
];

/** Columns */
const createColumns = (): DataTableColumns<FolderInterface> => {
  return [
    {
      type: 'selection',
    },
    {
      title: $i18n.t('storage.fileName'),
      key: 'name',
      render(row) {
        return [
          h(IconFolderFile, { isFile: row.type === 'file' }, ''),
          h(
            'span',
            {
              class: 'ml-2 text-blue cursor-pointer',
              onClick: () => onItemOpen(row),
            },
            row.name
          ),
        ];
      },
    },
    {
      title: $i18n.t('storage.fileCid'),
      key: 'CID',
      render(row) {
        return h(
          'span',
          { class: 'text-grey' },
          {
            default: () => truncateCid(row.CID || ''),
          }
        );
      },
    },
    {
      title: $i18n.t('storage.fileSize'),
      key: 'size',
      render(row) {
        return h('span', {}, { default: () => formatBytes(row.size || 0) });
      },
    },
    {
      title: $i18n.t('general.actions'),
      key: 'actions',
      align: 'right',
      className: '!py-0',
      render(row) {
        return h(
          NDropdown,
          {
            options: row.type === 'file' ? dropdownFileOptions : dropdownFolderOptions,
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

const rowKey = (row: FolderInterface) => row.id;

const handleCheck = (rowKeys: Array<number>) => {
  dataStore.folder.selectedItems = rowKeys;
};

function rowProps(row: FolderInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
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
  getDirectoryContent(dataStore.currentBucket.bucket_uuid, folder.id);
}

/**
 * Load data on mounted
 */
onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await getDirectoryContent();
    });
  }, 100);
});

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
    }
  }
);
const debouncedSearchFilter = debounce(getDirectoryContent, 500);

/** Function "Fetch directory content" wrapper  */
async function getDirectoryContent(bucketUuid?: string, folderId?: number, page: number = 1) {
  await dataStore.fetchDirectoryContent(
    $i18n,
    bucketUuid,
    folderId,
    page,
    PAGINATION_LIMIT,
    dataStore.folder.search
  );

  currentPage.value = page;
}
</script>
