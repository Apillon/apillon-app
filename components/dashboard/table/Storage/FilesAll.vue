<template>
  <n-space class="pb-8" :size="12" vertical>
    <n-space justify="space-between">
      <div class="w-[45vw] sm:w-[30vw] lg:w-[20vw] max-w-xs">
        <!-- <n-input
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
        </n-input> -->
      </div>
      <n-space>
        <!-- Refresh -->
        <n-button size="small" :loading="loading" @click="getFiles(currentPage)">
          <span class="icon-refresh text-xl mr-2"></span>
          {{ $t('general.refresh') }}
        </n-button>

        <!-- Filters 
        <select-options
          v-model:value="fileStatus"
          :options="fileStatuses"
          class="w-[45vw] sm:w-[30vw] lg:w-[20vw] max-w-xs"
          size="small"
          :placeholder="$t('form.placeholder.fileStatus')"
          filterable
          clearable
          @update:value="getFiles"
        />-->
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

const { t } = useI18n();
const dataStore = useDataStore();
const fileStore = useFileStore();

const loading = ref<boolean>(false);
const currentRow = ref<FileUploadSessionInterface>({} as FileUploadSessionInterface);

/** File status
const fileStatus = ref<number | undefined>();
const fileStatuses = ref<Array<SelectOption>>(
  enumValues(FileUploadSessionStatus).map(value => {
    return {
      value,
      label: FileUploadSessionStatus[value],
    };
  })
); */

/** Pagination data */
const currentPage = ref<number>(1);
const pagination = computed(() => {
  return {
    page: currentPage.value,
    pageSize: PAGINATION_LIMIT,
    pageCount: Math.ceil(fileStore.total / PAGINATION_LIMIT),
    itemCount: fileStore.total,
    prefix({ itemCount }) {
      return t('general.total', { total: itemCount });
    },
  };
});

/** Columns */
const createColumns = (): NDataTableColumns<FileUploadSessionInterface> => {
  return [
    {
      type: 'expand',
      renderExpand(row: FileUploadSessionInterface) {
        return h(resolveComponent('StorageSessionDetails'), { sessionUuid: row.session_uuid }, '');
      },
    },
    {
      title: t('storage.sessionUuid'),
      key: 'name',
      minWidth: 200,
      render(row: FileUploadSessionInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.session_uuid }, '');
      },
    },
    {
      title: t('storage.numOfFileUploadRequests'),
      key: 'numOfFileUploadRequests',
    },
    {
      title: t('storage.numOfUploadedFiles'),
      key: 'numOfUploadedFiles',
    },
    {
      key: 'createTime',
      title: t('dashboard.createTime'),
      render(row: FileUploadSessionInterface) {
        return h('span', {}, { default: () => dateTimeToDateAndTime(row.createTime || '') });
      },
    },
    {
      key: 'updateTime',
      title: t('general.updateTime'),
      render(row: FileUploadSessionInterface) {
        return h('span', {}, { default: () => dateTimeToDateAndTime(row.updateTime || '') });
      },
    },
    {
      title: t('storage.sessionStatus'),
      key: 'sessionStatus',
      render(row: FileUploadSessionInterface) {
        return h(resolveComponent('StorageSessionStatus'), { status: row.sessionStatus }, '');
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: FileUploadSessionInterface) => row.session_uuid;

function rowProps(row: FileUploadSessionInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
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
  loading.value = true;
  await fileStore.fetchAllFiles(null, { page });

  currentPage.value = page;
  loading.value = false;
}
</script>
