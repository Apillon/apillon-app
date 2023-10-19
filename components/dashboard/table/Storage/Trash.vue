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

      <n-space size="large">
        <!-- Refresh files -->
        <n-button size="small" :loading="fileStore.loading" @click="fileStore.fetchDeletedFiles()">
          <span class="icon-refresh text-xl mr-2"></span>
          {{ $t('general.refresh') }}
        </n-button>
      </n-space>
    </n-space>
    <n-data-table
      remote
      :bordered="false"
      :columns="columns"
      :data="data"
      :loading="fileStore.loading"
      :pagination="{ pageSize: PAGINATION_LIMIT }"
      :row-props="rowProps"
    />
  </n-space>
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NEllipsis, useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const bucketStore = useBucketStore();
const fileStore = useFileStore();
const IconFolderFile = resolveComponent('IconFolderFile');
const TableEllipsis = resolveComponent('TableEllipsis');

onMounted(() => {
  fileStore.search = '';
});

const currentRow = ref<BucketItemInterface>({} as BucketItemInterface);

/** Columns */
const createColumns = (): NDataTableColumns<BucketItemInterface> => {
  return [
    {
      key: 'name',
      title: $i18n.t('storage.fileName'),
      minWidth: 200,
      render(row) {
        return [h(IconFolderFile, { isFile: true }, ''), h('span', { class: 'ml-2 ' }, row.name)];
      },
    },
    {
      title: $i18n.t('storage.fileCid'),
      key: 'CID',
      render(row) {
        return h(TableEllipsis, { text: row.CID }, '');
      },
    },
    {
      title: $i18n.t('storage.downloadLink'),
      key: 'link',
      render(row: BucketItemInterface) {
        if (row.CID) {
          return [
            h(
              'div',
              { class: 'flex' },
              {
                default: () => [
                  h(
                    NEllipsis,
                    { class: 'text-body align-bottom', 'line-clamp': 1 },
                    { default: () => row.link }
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
      render(row: BucketItemInterface) {
        return h('span', {}, { default: () => datetimeToDate(row.createTime || '') });
      },
    },
    {
      title: $i18n.t('storage.contentType'),
      key: 'contentType',
      render(row: BucketItemInterface) {
        if (row.contentType) {
          return h('span', {}, row.contentType);
        }
        return '';
      },
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      className: '!py-0',
      render() {
        return h(
          NDropdown,
          {
            options: dropdownOptions,
            trigger: 'click',
          },
          {
            default: () =>
              h(
                NButton,
                { type: 'tertiary', size: 'small', quaternary: true, round: true },
                { default: () => h('span', { class: 'icon-more text-2xl' }, {}) }
              ),
          }
        );
      },
    },
  ];
};
const columns = createColumns();

/** Dropdown options for files */
const dropdownOptions = [
  {
    key: 'restore',
    label: $i18n.t('general.restore'),
    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
      onClick: () => {
        restore();
      },
    },
  },
];

function rowProps(row: BucketItemInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

/** Data: filtered files */
const data = computed<Array<BucketItemInterface>>(() => {
  return (
    fileStore.trash.filter(item =>
      item.name.toLocaleLowerCase().includes(fileStore.search.toLocaleLowerCase())
    ) || []
  );
});

/**
 * Restore file
 * */
async function restore() {
  bucketStore.loading = true;

  try {
    const restoredFile = await $api.patch<BucketItemResponse>(
      endpoints.storageFileRestore(
        bucketStore.bucketUuid,
        currentRow.value.file_uuid || currentRow.value.uuid
      )
    );

    removeTrashedFileFromList(restoredFile.data.file_uuid || restoredFile.data.uuid);
    message.success($i18n.t('form.success.restored.file'));
  } catch (error) {
    window.$message.error(userFriendlyMsg(error));
  }
  bucketStore.loading = false;
}

function removeTrashedFileFromList(uuid: string) {
  fileStore.trash = fileStore.trash.filter(item => item.file_uuid !== uuid && item.uuid !== uuid);
}
</script>
