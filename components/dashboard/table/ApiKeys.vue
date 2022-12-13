<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="settingsStore.apiKeys"
    :row-props="rowProps"
  />
  <!-- Modal - Delete API key -->
  <modal v-model:show="showModalDeleteApiKey" :title="$t('dashboard.apiKeyDelete')">
    <FormDelete :id="currentRow?.id || 0" type="apiKey" @submit-success="onApiKeyDeleted" />
    <FormApiKeyDelete
      :api-key-id="currentRow?.id || 0"
      @submit-success="showModalDeleteApiKey = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { NButton, NDropdown, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const message = useMessage();
const settingsStore = useSettingsStore();
const showModalDeleteApiKey = ref<boolean>(false);

const createColumns = (): DataTableColumns<ApiKeyInterface> => {
  return [
    {
      title: t('dashboard.secret'),
      key: 'secret',
      render(row) {
        return h('span', {}, hideSecret(row.apiKey));
      },
    },
    {
      title: t('dashboard.name'),
      key: 'name',
    },
    {
      title: t('dashboard.env'),
      key: 'env',
      render(row) {
        return h(
          'span',
          {},
          { default: () => (row.testNetwork === 1 ? t('general.test') : t('general.live')) }
        );
      },
    },
    {
      title: t('dashboard.created'),
      key: 'created',
      render(row) {
        return h('span', {}, { default: () => datetimeToDate(row.updateTime) });
      },
    },
    {
      title: t('general.actions'),
      key: 'actions',
      align: 'right',
      className: '!py-0',
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
                { size: 'small', quaternary: true },
                { default: () => h('span', { class: 'icon-more text-lg' }, {}) }
              ),
          }
        );
      },
    },
  ];
};

const currentRow = ref<ApiKeyInterface>({} as ApiKeyInterface);
const columns = createColumns();

function rowProps(row: ApiKeyInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

/**
 * Dropdown Actions
 */
const dropdownOptions = [
  {
    label: t('dashboard.clipboard.copyApiKey'),
    key: 'copy',
    props: {
      onClick: () => {
        copyToClipboard(currentRow.value.apiKey);
      },
    },
  },
  {
    label: t('general.delete'),
    key: 'delete',
    props: {
      onClick: () => {
        showModalDeleteApiKey.value = true;
      },
    },
  },
];

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      /* Resolved - text copied to clipboard successfully */
      message.success(t('dashboard.clipboard.copied'));
    },
    () => {
      /* Rejected - text failed to copy to the clipboard */
      message.warning(t('dashboard.clipboard.error'));
    }
  );
}

function onApiKeyDeleted() {
  showModalDeleteApiKey.value = false;
  settingsStore.fetchApiKeys();
}
</script>
