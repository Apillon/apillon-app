<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="postStore.items"
    :loading="postStore.loading"
    :expanded-row-keys="expandedRows"
    :pagination="chatStore.pagination"
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
  spaceUuid: { type: String, required: true },
});

const { t } = useI18n();
const chatStore = useChatStore();
const postStore = usePostStore();

const createColumns = (): NDataTableColumns<PostInterface> => {
  return [
    {
      type: 'expand',
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      renderExpand(row: PostInterface) {
        if (row.postId) {
          return h(
            resolveComponent('GrillChatSettings'),
            {
              spaceId: chatStore.active.spaceId,
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
      key: 'tags',
      title: t('social.post.tags'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'post_uuid',
      title: t('social.post.uuid'),
      render(row: PostInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.post_uuid }, '');
      },
    },
    {
      key: 'createTime',
      title: t('social.post.date'),
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
      title: '',
      key: 'actions',
      align: 'right',
      className: '!py-0',
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
    },
  ];
};

const columns = createColumns();
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
  const spaceId = chatStore.active.spaceId || 'space_uuid';

  if (spaceId) {
    postStore.updateSettings(`${spaceId}`);
  }
  console.log(postStore.settings);
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
  const spaceId = chatStore.active.spaceId || 'space_uuid';
  const postId = currentRow.value?.postId || '';

  if (spaceId && currentRow?.value) {
    postStore.updateSettings(`${spaceId}`, `${postId}`);
  }
  /** Expand selected row */
  expandedRows.value = expandedRows.value.includes(postId) ? [] : [postId];
}
</script>
