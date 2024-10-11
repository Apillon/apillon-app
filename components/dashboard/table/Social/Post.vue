<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="archive ? postStore.archive.items : postStore.items"
    :loading="archive ? postStore.archive.loading : postStore.loading"
    :expanded-row-keys="expandedRows"
    :pagination="{
      page: archive ? postStore.archive.pagination.page : postStore.pagination.page,
      pageSize: archive ? postStore.archive.pagination.pageSize : postStore.pagination.pageSize,
      itemCount: archive ? postStore.archive.pagination.itemCount : postStore.pagination.itemCount,
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

const props = defineProps({
  archive: { type: Boolean, default: false },
});

const { t } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const postStore = usePostStore();
const { deleteItem } = useDelete();

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
      className: props.archive ? 'hidden' : ON_COLUMN_CLICK_OPEN_CLASS,
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
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('postId') },
      ],
    },
    {
      key: 'title',
      title: t('social.post.title'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('title') },
      ],
    },
    {
      key: 'body',
      title: t('social.post.body'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('body') },
      ],
    },
    {
      key: 'hubName',
      title: t('social.chat.name'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('hubName') },
      ],
    },
    {
      key: 'tags',
      title: t('social.post.tags'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('tags') },
      ],
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
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
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
      render() {
        return h(
          NDropdown,
          {
            options: props.archive ? dropdownOptionsArchive : dropdownOptions,
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

      if (!props.archive && canOpenColumnCell(e.composedPath())) {
        selectPost();
      }
    },
  };
};

/**
 * Dropdown Actions
 */
const dropdownOptions = [
  {
    key: 'select',
    label: t('social.post.select'),
    props: {
      onClick: () => {
        selectPost();
      },
    },
  },
  {
    key: 'socialDelete',
    label: t('general.archive'),
    disabled: authStore.isAdmin(),
    props: {
      onClick: () => {
        deletePost();
      },
    },
  },
];

const dropdownOptionsArchive = [
  {
    key: 'postRestore',
    label: t('general.restore'),
    disabled: authStore.isAdmin(),
    props: {
      onClick: () => {
        restorePost();
      },
    },
  },
];

onMounted(() => {
  const spaceId = postStore.active?.hubId;
  const postId = postStore.active?.postId || '';

  if (spaceId && postId && !props.archive) {
    postStore.updateSettings(`${spaceId}`, `${postId}`);
  }

  /** Check if selected columns are stored in LS */
  if (localStorage.getItem(LsTableColumnsKeys.SOCIAL_POST)) {
    selectedColumns.value = JSON.parse(localStorage.getItem(LsTableColumnsKeys.SOCIAL_POST) || '');
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

watch(
  () => postStore.archive.search,
  _ => {
    postStore.archive.loading = true;
    debouncedSearchArchiveFilter();
  }
);
const debouncedSearchArchiveFilter = debounce(handlePageArchiveChange, 500);

/** On page change, load data */
async function handlePageChange(page: number) {
  await postStore.getPosts(page);
  postStore.pagination.page = page;
}
async function handlePageArchiveChange(page: number) {
  await postStore.getPostArchive(page);
  postStore.archive.pagination.page = page;
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

async function deletePost() {
  if (currentRow.value && (await deleteItem(ItemDeleteKey.POST, currentRow.value.post_uuid))) {
    postStore.items = postStore.items.filter(
      item => item.post_uuid !== currentRow.value?.post_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.POSTS);
    sessionStorage.removeItem(LsCacheKeys.POST_ARCHIVE);
  }
}

/**
 * Restore post
 * */
async function restorePost() {
  if (!currentRow.value?.post_uuid) return;

  postStore.loading = true;

  try {
    await $api.patch<PostResponse>(endpoints.postActivate(currentRow.value?.post_uuid));

    postStore.archive.items = postStore.archive.items.filter(
      item => item.post_uuid !== currentRow.value?.post_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.POSTS);
    sessionStorage.removeItem(LsCacheKeys.POST_ARCHIVE);

    message.success(t('form.success.restored.post'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  postStore.loading = false;
}
</script>
