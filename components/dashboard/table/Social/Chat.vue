<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="archive ? chatStore.archive.items : chatStore.items"
    :expanded-row-keys="expandedRows"
    :loading="archive ? chatStore.archive.loading : chatStore.loading"
    :pagination="{
      page: archive ? chatStore.archive.pagination.page : chatStore.pagination.page,
      pageSize: archive ? chatStore.archive.pagination.pageSize : chatStore.pagination.pageSize,
      itemCount: archive ? chatStore.archive.pagination.itemCount : chatStore.pagination.itemCount,
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

  <!-- Modal - Archive chat -->
  <ModalDelete v-model:show="showModalArchiveChat" :title="$t('social.chat.delete')">
    <template #content>
      <p>
        {{ $t('social.chat.deleteConfirm') }}
      </p>
    </template>

    <slot>
      <FormDeleteItems v-if="currentRow" :items="[currentRow]" @submit-success="onChatDeleted()" />
    </slot>
  </ModalDelete>
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
const chatStore = useChatStore();
const postStore = usePostStore();

const TableEllipsis = resolveComponent('TableEllipsis');
const GrillChatStatus = resolveComponent('GrillChatStatus');
const modalInfoVisible = ref<boolean>(false);
const showModalArchiveChat = ref<boolean | null>(false);

const createColumns = (): NDataTableColumns<ChatInterface> => {
  return [
    {
      type: 'expand',
      className: props.archive ? 'hidden' : ON_COLUMN_CLICK_OPEN_CLASS,
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
      minWidth: 80,
      className: props.archive ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'name',
      title: t('social.chat.name'),
      className: props.archive ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'about',
      title: t('social.chat.about'),
      className: props.archive ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'tags',
      title: t('social.chat.tags'),
      className: props.archive ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
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
          { options: props.archive ? dropdownOptionsArchive : dropdownOptions, trigger: 'click' },
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

      if (!props.archive && canOpenColumnCell(e.composedPath())) {
        selectChat();
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
  {
    key: 'socialDelete',
    label: t('general.delete'),
    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
      onClick: () => {
        showModalArchiveChat.value = true;
      },
    },
  },
];

const dropdownOptionsArchive = [
  {
    key: 'chatRestore',
    label: t('general.restore'),
    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
      onClick: () => {
        restoreChat();
      },
    },
  },
];

onMounted(() => {
  const spaceId = chatStore.active?.spaceId;
  if (spaceId && props.archive) {
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
watch(
  () => chatStore.archive.search,
  _ => {
    chatStore.archive.loading = true;
    debouncedSearchArchiveFilter();
  }
);
const debouncedSearchArchiveFilter = debounce(handlePageArchiveChange, 500);

/** On page change, load data */
async function handlePageChange(page: number) {
  await chatStore.getChats(page);
  chatStore.pagination.page = page;
}
async function handlePageArchiveChange(page: number) {
  await chatStore.getChatArchive(page);
  chatStore.archive.pagination.page = page;
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

/**
 * On chat deleted
 * Hide modal and refresh chat list
 * */
function onChatDeleted() {
  showModalArchiveChat.value = false;

  chatStore.items = chatStore.items.filter(
    item => item.space_uuid !== currentRow.value?.space_uuid
  );

  sessionStorage.removeItem(LsCacheKeys.CHATS);
  sessionStorage.removeItem(LsCacheKeys.CHAT_ARCHIVE);
}

/**
 * Restore chat
 * */
async function restoreChat() {
  if (!currentRow.value?.space_uuid) return;

  chatStore.loading = true;

  try {
    await $api.patch<ChatResponse>(endpoints.spaceActivate(currentRow.value?.space_uuid));

    chatStore.archive.items = chatStore.archive.items.filter(
      item => item.space_uuid !== currentRow.value?.space_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.CHATS);
    sessionStorage.removeItem(LsCacheKeys.CHAT_ARCHIVE);

    message.success(t('form.success.restored.chat'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  chatStore.loading = false;
}
</script>
