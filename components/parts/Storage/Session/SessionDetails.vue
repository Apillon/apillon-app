<template>
  <div class="bg-bg-dark -m-3 p-3">
    <n-data-table
      remote
      :bordered="false"
      :columns="columns"
      :data="sessions"
      :loading="loading"
      :pagination="pagination"
      :row-key="rowKey"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  sessionUuid: { type: String, required: true },
});

const { t } = useI18n();
const bucketStore = useBucketStore();

const loading = ref<boolean>(true);
const sessions = ref<FileUploadInterface[]>([]);
const pagination = reactive({
  itemCount: 0,
  page: 1,
  pageSize: PAGINATION_LIMIT,
  showSizePicker: true,
  pageSizes: enumValues(PageSize) as number[],
  prefix({ itemCount }) {
    return t('general.total', { total: itemCount });
  },
  onChange: (page: number) => {
    getSessionDetails(page, pagination.pageSize);
  },
  onUpdatePageSize: (pageSize: number) => {
    getSessionDetails(1, pageSize);
  },
});

/** Columns */
const createColumns = (): NDataTableColumns<FileUploadInterface> => {
  return [
    {
      title: t('storage.fileName'),
      key: 'name',
      minWidth: 200,
      render(row) {
        return [
          h(resolveComponent('IconFolderFile'), { isFile: true }, ''),
          h('span', { class: 'ml-2 ' }, row.fileName),
        ];
      },
    },
    {
      title: t('storage.fileStatusName'),
      key: 'fileStatus',
      render(row) {
        return h(
          'span',
          { class: 'text-body' },
          {
            default: () => t(`storage.file.status.${row.fileStatus}`),
          }
        );
      },
    },
    {
      title: t('storage.fileCid'),
      key: 'CID',
      render(row) {
        return h(resolveComponent('TableEllipsis'), { text: row.CID }, '');
      },
    },
    {
      title: t('storage.contentType'),
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

onMounted(async () => {
  await getSessionDetails();
});

async function getSessionDetails(page: number = 1, limit: number = PAGINATION_LIMIT) {
  loading.value = true;

  await fetchSessionDetails(props.sessionUuid, { page, limit });

  loading.value = false;
  pagination.page = page;
  pagination.pageSize = limit;
}

async function fetchSessionDetails(sessionUuid: string, args: FetchParams = {}) {
  try {
    const params = parseArguments(args);
    params.session_uuid = sessionUuid;

    const res = await $api.get<SessionDetailsResponse>(
      endpoints.storageFileUploads(bucketStore.bucketUuid),
      params
    );
    sessions.value = res.data.items;
    pagination.itemCount = res.data.total;
  } catch (error: any) {
    /** Show error message */
    window.$message.error(userFriendlyMsg(error));
  }
}
</script>
