<template>
  <n-space class="pb-8" :size="12" vertical>
    <n-space justify="space-between">
      <div class="w-[45vw] max-w-xs sm:w-[30vw] lg:w-[20vw]">
        <!-- 
        <FormFieldSearch v-model:value="fileStore.search" :placeholder="$t('storage.file.search')" /> 
          -->
      </div>
      <n-space>
        <!-- Refresh -->
        <n-button
          size="small"
          :loading="loading"
          @click="getFiles(fileStore.session.pagination.page, fileStore.session.pagination.pageSize)"
        >
          <span class="icon-refresh mr-2 text-xl"></span>
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
      :data="fileStore.session.items"
      :loading="loading"
      :pagination="{
        ...fileStore.session.pagination,
        onChange: (page: number) => {
          getFiles(page, fileStore.session.pagination.pageSize);
        },
        onUpdatePageSize: (pageSize: number) => {
          getFiles(1, pageSize);
        },
      }"
      :row-key="rowKey"
      :row-props="rowProps"
    />
  </n-space>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';

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
onMounted(async () => {
  fileStore.search = '';
  loading.value = true;

  await dataStore.waitOnPromises();
  await fileStore.getFileSessions();
  loading.value = false;
});

/** Search files */
watch(
  () => fileStore.search,
  _ => {
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = useDebounceFn(getFiles, 500);

/** Function "Fetch directory content" wrapper  */
async function getFiles(page: number = 1, limit: number = PAGINATION_LIMIT) {
  loading.value = true;
  await fileStore.fetchFileSessions(null, { page, limit });

  loading.value = false;
  fileStore.session.pagination.page = page;
  fileStore.session.pagination.pageSize = limit;
}
</script>
