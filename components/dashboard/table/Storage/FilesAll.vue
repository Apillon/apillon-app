<template>
  <n-space class="pb-8" :size="12" vertical>
    <n-space justify="space-between">
      <div class="w-[45vw] sm:w-[30vw] lg:w-[20vw] max-w-xs">
        <n-input
          v-model:value="search"
          type="text"
          name="search"
          size="small"
          :placeholder="$t('storage.file.search')"
          clearable
        >
          <template #prefix>
            <span class="icon-search text-xl"></span>
          </template>
        </n-input>
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
      :data="fileStore.all"
      :loading="loading"
      :pagination="pagination"
      :row-props="rowProps"
      @update:page="handlePageChange"
    />
  </n-space>
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const showModalDelete = ref<boolean>(false);
const drawerFileDetailsVisible = ref<boolean>(false);
const IconFolderFile = resolveComponent('IconFolderFile');

const search = ref<string>('');
const loading = ref<boolean>(false);

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
async function handleFilesStatusChange() {
  await getFiles();
}

/** Pagination data */
const currentPage = ref<number>(0);
const pagination = computed(() => {
  return {
    page: currentPage.value,
    pageSize: PAGINATION_LIMIT,
    pageCount: Math.ceil(fileStore.total / PAGINATION_LIMIT),
    itemCount: fileStore.total,
  };
});

/** Columns */
const createColumns = (): NDataTableColumns<FileUploadInterface> => {
  return [
    {
      title: $i18n.t('storage.fileName'),
      key: 'name',
      minWidth: 200,
      render(row) {
        return [
          h(IconFolderFile, { isFile: true }, ''),
          h('span', { class: 'ml-2 ' }, row.fileName),
        ];
      },
    },
    {
      title: $i18n.t('storage.fileStatusName'),
      key: 'fileStatus',
      render(row) {
        return h(
          'span',
          { class: 'text-body' },
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
          { class: 'text-body' },
          {
            default: () => truncateCid(row.CID || ''),
          }
        );
      },
    },
    {
      title: $i18n.t('storage.contentType'),
      key: 'contentType',
      render(row) {
        if (row.contentType) {
          return h('span', {}, row.contentType);
        }
        return '';
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
function onItemOpen(row: FileUploadInterface) {
  currentRow.value = row;
  drawerFileDetailsVisible.value = true;
}

/**
 * Load data on mounted
 */
onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      if (!dataStore.hasFileAll || isCacheExpired(LsCacheKeys.FILE_ALL)) {
        await getFiles();
      }
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
    const bucketUuid = bucketStore.bucketUuid;

    const params: Record<string, string | number> = {
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
      endpoints.storageFileUploads(bucketUuid),
      params
    );

    fileStore.all = res.data.items;
    fileStore.total = res.data.total;

    /** Save timestamp to SS */
    sessionStorage.setItem(LsCacheKeys.FILE_ALL, Date.now().toString());
  } catch (error: any) {
    /** Reset data */
    fileStore.all = [];
    fileStore.total = 0;

    /** Show error message */
    message.error(userFriendlyMsg(error));
  }

  loading.value = false;
}
</script>
