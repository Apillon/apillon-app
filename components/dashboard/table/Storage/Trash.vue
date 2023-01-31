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
      <n-space />
    </n-space>
    <n-data-table
      remote
      :bordered="false"
      :columns="columns"
      :data="dataStore.file.trash"
      :loading="loading"
      :pagination="{ pageSize: PAGINATION_LIMIT }"
      :row-props="rowProps"
    />
  </n-space>
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
import { NButton, NDropdown, NEllipsis, useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const showModalDelete = ref<boolean>(false);
const drawerFileDetailsVisible = ref<boolean>(false);
const IconFolderFile = resolveComponent('IconFolderFile');

const search = ref<string>('');
const loading = ref<boolean>(false);

const currentRow = ref<BucketItemInterface>({} as BucketItemInterface);

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
      class: '!text-pink',
      onClick: () => {
        showModalDelete.value = true;
      },
    },
  },
];

/** Columns */
const createColumns = (): NDataTableColumns<BucketItemInterface> => {
  return [
    {
      title: $i18n.t('storage.fileName'),
      key: 'name',
      minWidth: 150,
      render(row) {
        return [h(IconFolderFile, { isFile: true }, ''), h('span', { class: 'ml-2 ' }, row.name)];
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
                    { class: 'text-grey align-bottom', 'line-clamp': 1 },
                    { default: () => row.link }
                  ),
                  h(
                    'button',
                    { class: 'ml-2', onClick: () => copyToClipboard(row.link) },
                    h('span', { class: 'icon-copy text-grey' }, {})
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
      title: $i18n.t('general.actions'),
      key: 'actions',
      align: 'right',
      className: '!py-0 hidden',
      render() {
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

function rowProps(row: BucketItemInterface) {
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
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await getFiles();
    });
  }, 100);
});

/** Search files */
watch(
  () => search.value,
  _ => {
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = debounce(fetchFiles, 500);

/** Function "Fetch directory content" wrapper  */
async function getFiles() {
  if (!dataStore.hasDeletedFiles || isCacheExpired(LsCacheKeys.FILE_DELETED)) {
    await fetchFiles();
  }
}

async function fetchFiles() {
  loading.value = true;

  try {
    const bucketUuid = dataStore.bucketUuid;

    const res = await $api.get<FolderResponse>(endpoints.storageFilesTrashed(bucketUuid));

    dataStore.file.trash = res.data.items;

    /** Save timestamp to SS */
    sessionStorage.setItem(LsCacheKeys.FILE_DELETED, Date.now().toString());
  } catch (error: any) {
    /** Reset data */
    dataStore.file.trash = [];

    /** Show error message */
    message.error(userFriendlyMsg(error));
  }

  loading.value = false;
}
</script>
