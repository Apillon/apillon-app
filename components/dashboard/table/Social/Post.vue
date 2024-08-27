<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="postStore.items"
    :loading="postStore.loading"
    :expanded-row-keys="expandedRows"
    :pagination="{
      ...postStore.pagination,
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
const postStore = usePostStore();

/** Available columns - show/hide column */
const selectedColumns = ref(['postId', 'title', 'body', 'hubName', 'tags', 'post_uuid', 'status']);
const availableColumns = ref([
  { value: 'postId', label: t('social.post.postId') },
  { value: 'title', label: t('social.post.title') },
  { value: 'body', label: t('social.post.body') },
  { value: 'hubName', label: t('social.chat.name') },
  { value: 'tags', label: t('social.post.tags') },
  { value: 'post_uuid', label: t('social.post.uuid') },
  { value: 'createTime', label: t('social.post.date') },
  { value: 'status', label: t('general.status') },
]);

const columns = computed<NDataTableColumns<PostInterface>>(() => {
  return [
    {
      type: 'expand',
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      renderExpand(row: PostInterface) {
        if (row.postId) {
          return h(
            resolveComponent('GrillChatSettings'),
            {
              spaceId: row.hubId,
              postId: row.postId,
            },
            ''
          );
        }
        return null;
      },
    },
    {
      key: 'postId',
      title: t('social.post.postId'),
      className: [
        ON_COLUMN_CLICK_OPEN_CLASS,
        { hidden: !selectedColumns.value.includes('postId') },
      ],
    },
    {
      key: 'title',
      title: t('social.post.title'),
      className: [ON_COLUMN_CLICK_OPEN_CLASS, { hidden: !selectedColumns.value.includes('title') }],
    },
    {
      key: 'body',
      title: t('social.post.body'),
      className: [ON_COLUMN_CLICK_OPEN_CLASS, { hidden: !selectedColumns.value.includes('body') }],
    },
    {
      key: 'hubName',
      title: t('social.chat.name'),
      className: [
        ON_COLUMN_CLICK_OPEN_CLASS,
        { hidden: !selectedColumns.value.includes('hubName') },
      ],
    },
    {
      key: 'tags',
      title: t('social.post.tags'),
      className: [ON_COLUMN_CLICK_OPEN_CLASS, { hidden: !selectedColumns.value.includes('tags') }],
    },
    {
      key: 'post_uuid',
      title: t('social.post.uuid'),
      className: [{ hidden: !selectedColumns.value.includes('post_uuid') }],
      render(row: PostInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.post_uuid }, '');
      },
    },
    {
      key: 'createTime',
      title: t('social.post.date'),
      className: [
        ON_COLUMN_CLICK_OPEN_CLASS,
        { hidden: !selectedColumns.value.includes('createTime') },
      ],
      render(row) {
        return h('span', { class: 'text-body' }, dateTimeToDateAndTime(row?.createTime || ''));
      },
    },
    {
      key: 'status',
      title: t('general.status'),
      className: [{ hidden: !selectedColumns.value.includes('status') }],
      render(row) {
        return h(resolveComponent('GrillChatStatus'), { status: row.status }, '');
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      className: '!py-0 !sticky right-0',
      filter: 'default',
      filterOptionValue: null,
      render() {
        return h(
          NDropdown,
          { options: dropdownOptions.value, trigger: 'click' },
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
      renderFilterIcon: () => {
        return h('span', { class: 'icon-more' }, '');
      },
      renderFilterMenu: () => {
        return h(
          resolveComponent('TableColumns'),
          {
            model: selectedColumns.value,
            columns: availableColumns.value,
            onColumnChange: handleColumnChange,
          },
          ''
        );
      },
    },
  ];
});

const rowKey = (row: PostInterface) => row.postId;
const currentRow = ref<PostInterface | null>(null);
const expandedRows = ref<Array<string | number>>([]);

const rowClassName = (row: PostInterface) => {
  return currentRow.value && currentRow.value?.postId === row.postId ? 'selected-row' : '';
};

/** On row click */
const rowProps = (row: PostInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        selectPost();
      }
    },
  };
};

/**
 * Dropdown Actions
 */
const dropdownOptions = computed(() => {
  return [
    {
      key: 'select',
      label: t('social.post.select'),
      props: {
        onClick: () => {
          selectPost();
        },
      },
    },
  ];
});

onMounted(() => {
  const spaceId = postStore.active?.hubId;
  const postId = postStore.active?.postId || '';

  if (spaceId && postId) {
    postStore.updateSettings(`${spaceId}`, `${postId}`);
  }
});

/** Search posts */
watch(
  () => postStore.search,
  _ => {
    postStore.loading = true;
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = debounce(handlePageChange, 500);

/** On page change, load data */
async function handlePageChange(page: number) {
  await postStore.getPosts(page);
  postStore.pagination.page = page;
}

async function selectPost() {
  if (currentRow.value) {
    const spaceId = currentRow.value.hubId;
    const postId = currentRow.value.postId;

    postStore.active = currentRow.value;
    if (spaceId && postId) {
      postStore.updateSettings(`${spaceId}`, `${postId}`);
    }

    /** Expand selected row */
    expandedRows.value = expandedRows.value.includes(postId) ? [] : [postId];
  }
}

function handleColumnChange(selectedValues: Array<string>) {
  selectedColumns.value = selectedValues;
  localStorage.setItem(LsTableColumnsKeys.SOCIAL_POST, JSON.stringify(selectedColumns.value));
}
</script>
