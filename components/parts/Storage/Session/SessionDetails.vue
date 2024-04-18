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
      @update:page="handlePageChange"
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
  page: 1,
  pageSize: PAGINATION_LIMIT,
  itemCount: 0,
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
  await getSessionDetails(props.sessionUuid);
});

async function handlePageChange(currentPage: number) {
  await getSessionDetails(props.sessionUuid, currentPage);
}

async function getSessionDetails(sessionUuid: string, page = 1) {
  loading.value = true;
  pagination.page = page;

  await fetchSessionDetails(sessionUuid, page);
  loading.value = false;
}

async function fetchSessionDetails(sessionUuid: string, page: number) {
  try {
    const params = parseArguments({ page });
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
