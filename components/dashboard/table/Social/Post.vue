<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="postStore.items"
    :loading="postStore.loading"
    :row-key="rowKey"
    :row-props="rowProps"
    :row-class-name="rowClassName"
    :pagination="{
      ...postStore.pagination,
      onChange: (page: number) => {
        postStore.pagination.page = page;
        handlePageChange(page);
      },
    }"
  />
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
import { NButton, NDropdown } from 'naive-ui';
import { generateGrillSettings } from '~/stores/social/chat';

const props = defineProps({
  spaceUuid: { type: String, required: true },
});

const { t } = useI18n();
const chatStore = useChatStore();
const postStore = usePostStore();
const TableEllipsis = resolveComponent('TableEllipsis');

const createColumns = (): NDataTableColumns<PostInterface> => {
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
      key: 'tags',
      title: t('social.post.tags'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'post_uuid',
      title: t('social.post.uuid'),
      render(row: PostInterface) {
        return h(TableEllipsis, { text: row.post_uuid }, '');
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
const rowKey = (row: PostInterface) => row.post_uuid;
const currentRow = ref<PostInterface | null>(postStore.items[0] || null);

const rowClassName = (row: PostInterface) => {
  return row.post_uuid === currentRow.value?.post_uuid ? 'selected-row' : '';
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
      label: 'Select post',
      key: 'select',
      props: {
        onClick: () => {
          console.log('select post', currentRow.value);
          selectPost();
        },
      },
    },
  ];
});

onMounted(() => {
  selectPost();
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
  await postStore.getPosts(props.spaceUuid, page);
}

async function selectPost() {
  const spaces = await chatStore.getChats();
  const space = spaces.find(item => item.space_uuid === props.spaceUuid);

  if (space && currentRow?.value) {
    console.log(`${props.spaceUuid}`, `${currentRow.value.postId}`);
    chatStore.settings = generateGrillSettings(`${props.spaceUuid}`, `${currentRow.value.postId}`);
  }
}
</script>
