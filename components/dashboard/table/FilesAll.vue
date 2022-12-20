<template>
  <n-space vertical :size="12">
    <n-space justify="space-between">
      <div class="w-[45vw] sm:w-[30vw] lg:w-[20vw] max-w-xs">
        <n-input
          v-model:value="search"
          type="text"
          name="search"
          size="small"
          class="bg-grey-dark"
          placeholder="Search files"
        />
      </div>
      <n-space>
        <!-- Fitlers -->
        <select-options
          v-model:value="fileStatus"
          :options="fileStatuses"
          class="w-[45vw] sm:w-[30vw] lg:w-[20vw] max-w-xs"
          size="small"
          :placeholder="$t('form.placeholder.fileStatus')"
          filterable
          clearable
          @update:value="handleFilesStatusChange"
        />
      </n-space>
    </n-space>
    <n-data-table
      remote
      :bordered="false"
      :columns="columns"
      :data="files"
      :loading="loading"
      :pagination="pagination"
      :row-props="rowProps"
      @update:page="handlePageChange"
    />
  </n-space>

  <!-- Drawer - File details -->
  <n-drawer v-model:show="drawerFileDetailsVisible" :width="495">
    <n-drawer-content v-if="drawerFileDetailsVisible">
      <StorageFileDetails
        v-if="currentRow.CID || currentRow.file_uuid"
        :file-cid="currentRow.CID"
        :file-uuid="currentRow.file_uuid"
      />
    </n-drawer-content>
  </n-drawer>

  <!-- Modal - Delete file -->
  <modal v-model:show="showModalDelete" :title="$t(`storage.file.delete`)">
    <FormStorageFolderDelete :id="currentRow.id" type="file" @submit-success="onDeleted" />
  </modal>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash';
import { DataTableColumns, NButton, NDropdown, useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const showModalDelete = ref<boolean>(false);
const drawerFileDetailsVisible = ref<boolean>(false);
const IconFolderFile = resolveComponent('IconFolderFile');

const search = ref<string>('');
const loading = ref<boolean>(false);
const files = ref<Array<FileUploadInterface>>([]);
const total = ref<number>(0);

const currentRow = ref<FileUploadInterface>({} as FileUploadInterface);

/** File status */
const fileStatus = ref<number | null>(null);
const fileStatuses = ref<Array<NSelectOption>>([
  {
    value: 1,
    label: $i18n.t(
      `storage.fileStatus.${FileUploadRequestFileStatus.SIGNED_URL_FOR_UPLOAD_GENERATED}`
    ),
  },
  {
    value: 2,
    label: $i18n.t(`storage.fileStatus.${FileUploadRequestFileStatus.UPLOADED_TO_S3}`),
  },
  {
    value: 3,
    label: $i18n.t(`storage.fileStatus.${FileUploadRequestFileStatus.UPLOADED_TO_IPFS}`),
  },
  {
    value: 4,
    label: $i18n.t(`storage.fileStatus.${FileUploadRequestFileStatus.PINNED_TO_CRUST}`),
  },
  {
    value: 5,
    label: $i18n.t(`storage.fileStatus.${FileUploadRequestFileStatus.UPLOAD_COMPLETED}`),
  },
  {
    value: 100,
    label: $i18n.t(`storage.fileStatus.${FileUploadRequestFileStatus.ERROR_UPLOADING_TO_IPFS}`),
  },
  {
    value: 101,
    label: $i18n.t(`storage.fileStatus.${FileUploadRequestFileStatus.ERROR_PINING_TO_CRUST}`),
  },
  {
    value: 102,
    label: $i18n.t(`storage.fileStatus.${FileUploadRequestFileStatus.ERROR_FILE_NOT_EXISTS_ON_S3}`),
  },
  {
    value: 103,
    label: $i18n.t(`storage.fileStatus.${FileUploadRequestFileStatus.ERROR_BUCKET_FULL}`),
  },
]);
async function handleFilesStatusChange(value: string, option: NSelectOption) {
  await getFiles();
}

/** Pagination data */
const currentPage = ref<number>(0);
const pagination = computed(() => {
  return {
    page: currentPage.value,
    pageSize: PAGINATION_LIMIT,
    pageCount: Math.ceil(total.value / PAGINATION_LIMIT),
    itemCount: total.value,
  };
});

/** Dropdown options for files */
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
const createColumns = (): DataTableColumns<FileUploadInterface> => {
  return [
    {
      title: $i18n.t('storage.fileName'),
      key: 'name',
      render(row) {
        return [
          h(IconFolderFile, { isFile: true }, ''),
          h(
            'span',
            {
              class: 'ml-2 text-blue cursor-pointer',
              onClick: () => onItemOpen(row),
            },
            row.fileName
          ),
        ];
      },
    },
    {
      title: $i18n.t('storage.fileStatusName'),
      key: 'fileStatus',
      render(row) {
        return h(
          'span',
          { class: 'text-grey' },
          {
            default: () => $i18n.t(`storage.fileStatus.${row.fileStatus}`),
          }
        );
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
      title: $i18n.t('general.actions'),
      key: 'actions',
      align: 'right',
      className: '!py-0',
      render(row) {
        return h(
          NDropdown,
          {
            options: dropdownFileOptions,
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

function rowProps(row: FileUploadInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

/** Action when user click on File name */
async function onItemOpen(row: FileUploadInterface) {
  currentRow.value = row;
  drawerFileDetailsVisible.value = true;
}

/**
 * Load data on mounted
 */
onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await getFiles();
    });
  }, 100);
});

/** On page change, load data */
async function handlePageChange(currentPage: number) {
  if (!loading.value) {
    await getFiles(currentPage);
  }
}

/** On file deleted, refresh file list */
async function onDeleted() {
  await getFiles();
  showModalDelete.value = false;
}

/** Search files */
watch(
  () => search.value,
  _ => {
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = debounce(getFiles, 500);

/** Function "Fetch directory content" wrapper  */
async function getFiles(page: number = 1) {
  await fetchFiles(page, PAGINATION_LIMIT);

  currentPage.value = page;
}

async function fetchFiles(page?: number, limit?: number) {
  loading.value = true;

  try {
    const bucketUuid = dataStore.currentBucket.bucket_uuid;

    let params: Record<string, string | number> = {
      bucket_uuid: bucketUuid,
    };

    /** Add additional parameters */
    if (search.value) {
      params.search = search.value;
    }
    if (fileStatus.value) {
      params.fileStatus = fileStatus.value;
    }
    if (page) {
      params.page = page;
      params.limit = limit || PAGINATION_LIMIT;
    }

    const res = await $api.get<FileUploadsResponse>(
      `${endpoints.storage}${bucketUuid}/file-uploads`,
      params
    );

    files.value = res.data.items;
    total.value = res.data.total;
  } catch (error: any) {
    /** Reset data */
    files.value = [];
    total.value = 0;

    /** Show error message */
    message.error(userFriendlyMsg(error, $i18n));
  }

  loading.value = false;
}
</script>
