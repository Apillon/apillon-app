<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="chatStore.items"
    :expanded-row-keys="expandedRows"
    :loading="chatStore.loading"
    :pagination="{
      ...chatStore.pagination,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page="handlePageChange"
  />
  <!-- Modal - Create Service -->
  <modal v-model:show="modalInfoVisible" :title="$t('social.chat.settings')">
    <GrillChatSettings :space-id="`${currentRow?.spaceId}`" />
  </modal>
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const chatStore = useChatStore();
const postStore = usePostStore();

const TableEllipsis = resolveComponent('TableEllipsis');
const GrillChatStatus = resolveComponent('GrillChatStatus');
const modalInfoVisible = ref<boolean>(false);

const createColumns = (): NDataTableColumns<ChatInterface> => {
  return [
    {
      type: 'expand',
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      renderExpand(row: ChatInterface) {
        if (row.spaceId) {
          return h(
            resolveComponent('GrillChatSettings'),
            {
              spaceId: row.spaceId,
            },
            ''
          );
        }
        return null;
      },
    },
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
const rowKey = (row: ChatInterface) => row.spaceId || '';
const currentRow = ref<ChatInterface | null>(chatStore.items[0] || null);
const expandedRows = ref<Array<string | number>>([]);

/** On row click */
const rowProps = (row: ChatInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        selectChat();
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
      label: t('social.chat.select'),
      props: {
        onClick: () => {
          selectChat();
        },
      },
    },
    {
      label: t('social.chat.showSettings'),
      key: 'settings',
      props: {
        onClick: () => {
          modalInfoVisible.value = true;
        },
      },
    },
  ];
});

onMounted(() => {
  const spaceId = chatStore.active?.spaceId;
  if (spaceId) {
    postStore.updateSettings(`${spaceId}`);
  }
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

async function selectChat() {
  if (currentRow.value) {
    const spaceId = currentRow.value.spaceId;

    chatStore.active = currentRow.value;
    if (spaceId) {
      postStore.updateSettings(`${spaceId}`);

      /** Expand selected row */
      expandedRows.value = expandedRows.value.includes(spaceId) ? [] : [spaceId];
    }
  }
}
</script>
