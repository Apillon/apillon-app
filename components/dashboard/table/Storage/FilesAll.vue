<template>
  <n-space class="pb-8" :size="12" vertical>
    <n-space justify="space-between">
      <div class="w-[45vw] sm:w-[30vw] lg:w-[20vw] max-w-xs">
        <n-input
          v-model:value="fileStore.search"
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
      <n-space>
        <!-- Filters -->
        <select-options
          v-model:value="fileStatus"
          :options="fileStatuses"
          class="w-[45vw] sm:w-[30vw] lg:w-[20vw] max-w-xs"
          size="small"
          :placeholder="$t('form.placeholder.fileStatus')"
          filterable
          clearable
          @update:value="getFiles"
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
      :row-key="rowKey"
      :row-props="rowProps"
      @update:page="handlePageChange"
    />
  </n-space>
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
import type { SelectOption } from 'naive-ui';

const $i18n = useI18n();
const dataStore = useDataStore();
const fileStore = useFileStore();
const showModalDelete = ref<boolean>(false);
const drawerFileDetailsVisible = ref<boolean>(false);
const IconFolderFile = resolveComponent('IconFolderFile');

const loading = ref<boolean>(false);
const currentRow = ref<FileUploadInterface>({} as FileUploadInterface);

/** File status */
const fileStatus = ref<number | undefined>();
const fileStatuses = ref<Array<SelectOption>>(
  enumValues(FileUploadRequestFileStatus).map(value => {
    return {
      value,
      label: $i18n.t(`storage.file.status.${value}`),
    };
  })
);

/** Pagination data */
const currentPage = ref<number>(1);
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
            default: () => $i18n.t(`storage.file.status.${row.fileStatus}`),
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
const rowKey = (row: FileUploadInterface) => row.file_uuid;

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
  fileStore.search = '';

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      fileStore.getAllFiles();
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
  () => fileStore.search,
  _ => {
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = debounce(getFiles, 500);

/** Function "Fetch directory content" wrapper  */
async function getFiles(page: number = 1) {
  await fileStore.fetchAllFiles(fileStatus.value, { page });

  currentPage.value = page;
}
</script>
