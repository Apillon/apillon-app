<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="dataStore.currentFolderContent"
    :loading="tableLoading"
    :pagination="pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:checked-row-keys="handleCheck"
    @update:page="handlePageChange"
  />

  <!-- Drawer - File details -->
  <n-drawer v-model:show="drawerFileDetailsVisible" :width="495">
    <n-drawer-content v-if="fileDetails.file">
      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.fileName') }}</p>
        <strong>{{ fileDetails.file.name }}</strong>
      </div>

      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.fileCid') }}</p>
        <strong>{{ fileDetails.file.CID }}</strong>
      </div>

      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.fileSize') }}</p>
        <strong>{{ formatBytes(fileDetails.file.size) }}</strong>
      </div>

      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.expiration') }}</p>
        <strong>{{ fileExpiration(fileDetails.crustStatus.expired_at) }}</strong>
      </div>

      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.replicas') }}</p>
        <strong>{{ fileDetails.crustStatus.reported_replica_count }}</strong>
      </div>

      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.status') }}</p>
        <n-tag v-if="fileDetails.file.status === 5" type="success" :bordered="false" round>{{
          $t('general.ok')
        }}</n-tag>
        <n-tag v-else type="error" :bordered="false" round>{{ $t('general.error') }}</n-tag>
      </div>

      <div class="mb-4">
        <p class="body-sm">{{ $t('general.actions') }}</p>
      </div>
      <Btn type="secondary" size="large">{{ $t('storage.renewPoolBalance') }}</Btn>
    </n-drawer-content>
    <AnimationLoader v-else />
  </n-drawer>

  <!-- Modal - Delete file/folder -->
  <n-modal v-model:show="showModalDelete">
    <n-card
      style="width: 660px"
      :title="$t(`storage.${currentRow.type}.delete`)"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <FormStorageFolderDelete
        :id="currentRow.id"
        :type="currentRow.type"
        @submit-success="onDeleted"
      />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash';
import { DataTableColumns, DataTableRowKey, NButton, NDropdown, NTag } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const dataStore = useDataStore();
const tableLoading = ref<boolean>(false);
const showModalDelete = ref<boolean>(false);
const drawerFileDetailsVisible = ref<boolean>(false);
const IconFolderFile = resolveComponent('IconFolderFile');

const currentRow = ref<FolderInterface>({} as FolderInterface);
const selectedRows = ref<DataTableRowKey[]>([]);
const fileDetails = ref<FileDetailsInterface>({} as FileDetailsInterface);

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
      onClick: () => {},
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
      onClick: async () => {
        drawerFileDetailsVisible.value = true;

        /** Fetch file details */
        fileDetails.value = await dataStore.fetchFileDetails(
          currentRow.value.fileUuid || '',
          $i18n
        );
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
      title: $i18n.t('storage.expiration'),
      key: 'expiration',
    },
    {
      title: $i18n.t('storage.replicas'),
      key: 'replicas',
    },
    {
      title: $i18n.t('storage.status'),
      key: 'active',
      render(row) {
        return h(
          NTag,
          { type: row.id ? 'success' : 'error', round: true, bordered: false },
          {
            default: () => (row.id ? $i18n.t('general.ok') : $i18n.t('general.error')),
          }
        );
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

const handleCheck = (rowKeys: DataTableRowKey[]) => {
  selectedRows.value = rowKeys;
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
  if (row.type === 'file') {
    drawerFileDetailsVisible.value = true;

    /** Fetch file details */
    fileDetails.value = await dataStore.fetchFileDetails(row.fileUuid || '', $i18n);
  } else if (row.type === 'directory') {
    /** Fetch data in reset search string */
    dataStore.folder.search = '';
    getDirectoryContent(dataStore.currentBucket.bucket_uuid, row.id);
  } else {
    console.warn("Unknown item type: it should be of type 'file' or 'directory'!");
  }
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
  if (!tableLoading.value) {
    await getDirectoryContent(
      dataStore.currentBucket.bucket_uuid,
      dataStore.selected.folderId,
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
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = debounce(getDirectoryContent, 350);

/** Function "Fetch directory content" wrapper  */
async function getDirectoryContent(bucketUuid?: string, folderId?: number, page: number = 1) {
  tableLoading.value = true;
  const offset = (page - 1) * PAGINATION_LIMIT;

  await dataStore.fetchDirectoryContent(
    $i18n,
    bucketUuid,
    folderId,
    offset,
    PAGINATION_LIMIT,
    dataStore.folder.search
  );

  currentPage.value = page;
  tableLoading.value = false;
}
</script>
