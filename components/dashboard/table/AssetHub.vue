<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="assetHubStore.items"
    :loading="assetHubStore.loading"
    :expanded-row-keys="expandedRows"
    :pagination="{
      ...assetHubStore.pagination,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
    :row-key="rowKey"
    :row-props="rowProps"
    :row-class-name="rowClassName"
    @update:page="handlePageChange"
  />
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const assetHubStore = useAssetHubStore();

const columns = computed<NDataTableColumns<AssetInterface>>(() => {
  return [
    {
      key: 'postId',
      title: t('social.post.postId'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'title',
      title: t('social.post.title'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'body',
      title: t('social.post.body'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'hubName',
      title: t('social.chat.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'tags',
      title: t('social.post.tags'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'post_uuid',
      title: t('social.post.uuid'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row: AssetInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.post_uuid }, '');
      },
    },
    {
      key: 'createTime',
      title: t('social.post.date'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('span', { class: 'text-body' }, dateTimeToDateAndTime(row?.createTime || ''));
      },
    },
    {
      key: 'status',
      title: t('general.status'),
      render(row) {
        return h(resolveComponent('GrillChatStatus'), { status: row.status }, '');
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      className: '!py-0 !sticky right-0',
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
});

const rowKey = (row: AssetInterface) => row.postId;
const currentRow = ref<AssetInterface | null>(null);
const expandedRows = ref<Array<string | number>>([]);

const rowClassName = (row: AssetInterface) => {
  return currentRow.value && currentRow.value?.postId === row.postId ? 'selected-row' : '';
};

/** On row click */
const rowProps = (row: AssetInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push(`/dashboard/service/asset-hub/${row.uuid}`);
      }
    },
  };
};

/**
 * Dropdown Actions
 */
const dropdownOptions = [
  {
    key: 'view',
    label: t('social.post.select'),
    props: {
      onClick: () => {
        router.push(`/dashboard/service/asset-hub/${currentRow.value?.uuid}`);
      },
    },
  },
];

onMounted(() => {});

/** Search posts */
watch(
  () => assetHubStore.search,
  _ => {
    assetHubStore.loading = true;
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = debounce(handlePageChange, 500);

/** On page change, load data */
async function handlePageChange(page: number) {
  await assetHubStore.getAssets(page);
  assetHubStore.pagination.page = page;
}
</script>
