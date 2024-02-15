<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="chatStore.items"
    :loading="chatStore.loading"
    :pagination="chatStore.pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page="handlePageChange"
  />
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();
const chatStore = useChatStore();
const TableEllipsis = resolveComponent('TableEllipsis');
const GrillChatStatus = resolveComponent('GrillChatStatus');

const createColumns = (): NDataTableColumns<ChatInterface> => {
  return [
    {
      key: 'spaceId',
      title: t('social.chat.spaceId'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'name',
      title: t('social.chat.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'about',
      title: t('social.chat.about'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'tags',
      title: t('social.chat.tags'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'contract_uuid',
      title: t('social.chat.uuid'),
      render(row: ChatInterface) {
        return h(TableEllipsis, { text: row.space_uuid }, '');
      },
    },
    {
      key: 'createTime',
      title: t('social.chat.date'),
      render(row) {
        return h('span', { class: 'text-body' }, dateTimeToDateAndTime(row?.createTime || ''));
      },
    },
    {
      key: 'status',
      title: t('general.status'),
      render(row) {
        return h(GrillChatStatus, { status: row.status }, '');
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
const rowKey = (row: ChatInterface) => row.space_uuid;
const currentRow = ref<ChatInterface | null>(chatStore.items[0] || null);

/** On row click */
const rowProps = (row: ChatInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/social/${row.space_uuid}` });
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
      label: t('general.view'),
      key: 'view',
      props: {
        onClick: () => {
          router.push({ path: `/dashboard/service/social/${currentRow.value?.space_uuid}` });
        },
      },
    },
  ];
});

/** Search chats */
watch(
  () => chatStore.search,
  _ => {
    chatStore.loading = true;
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = debounce(handlePageChange, 500);

/** On page change, load data */
async function handlePageChange(page: number) {
  await chatStore.getChats(page);
  chatStore.pagination.page = page;
}
</script>
