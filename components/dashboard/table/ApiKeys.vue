<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="settingsStore.apiKeys"
    :row-props="rowProps"
  />

  <!-- Drawer - Update API Key -->
  <n-drawer v-model:show="drawerUpdateApiKeyVisible" :width="495">
    <n-drawer-content>
      <template #header>
        <h5>{{ $t('dashboard.apiKey.update') }}</h5>
      </template>
      <FormApiKeyUpdate :id="currentRow.id" @submit-success="drawerUpdateApiKeyVisible = false" />
    </n-drawer-content>
  </n-drawer>

  <!-- Modal - Delete API key -->
  <ModalDelete v-model:show="showModalDeleteApiKey" :title="$t('dashboard.apiKey.delete')">
    <FormDelete :id="currentRow?.id || 0" type="apiKey" @submit-success="onApiKeyDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const settingsStore = useSettingsStore();
const showModalDeleteApiKey = ref<boolean>(false);
const drawerUpdateApiKeyVisible = ref<boolean>(false);

const createColumns = (): NDataTableColumns<ApiKeyInterface> => {
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
        copyToClipboard(currentRow.value.apiKey, t);
      },
    },
  },
  {
    label: t('general.edit'),
    key: 'edit',
    disabled: settingsStore.isProjectUser(),
    props: {
      onClick: () => {
        drawerUpdateApiKeyVisible.value = true;
      },
    },
  },
  {
    label: t('general.delete'),
    key: 'delete',
    disabled: settingsStore.isProjectUser(),
    props: {
      onClick: () => {
        showModalDeleteApiKey.value = true;
      },
    },
  },
];

function onApiKeyDeleted() {
  showModalDeleteApiKey.value = false;
  settingsStore.fetchApiKeys();
}
</script>
