<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="ewApiKeyStore.items"
    :loading="chatStore.loading"
  />
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const chatStore = useChatStore();
const ewApiKeyStore = useEwApiKeyStore();

const modalInfoVisible = ref<boolean>(false);

const createColumns = (): NDataTableColumns<EwApiKeyInterface> => {
  return [
    {
      key: 'secret',
      title: t('embeddedWallet.table.secret'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'name',
      title: t('embeddedWallet.table.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'env',
      title: t('embeddedWallet.table.environment'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },

    {
      key: 'created',
      title: t('embeddedWallet.table.created'),
      render(row) {
        return h('span', { class: 'text-body' }, dateTimeToDateAndTime(row?.createTime || ''));
      },
    },
    {
      key: 'usage',
      title: t('embeddedWallet.table.usage'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
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
          // selectChat();
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
</script>
