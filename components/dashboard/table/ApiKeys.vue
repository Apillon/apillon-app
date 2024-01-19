<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="settingsStore.apiKeys"
    :row-props="rowProps"
  />

  <!-- Drawer - Update API Key -->
  <n-drawer v-model:show="drawerUpdateApiKeyVisible" :width="495">
    <n-drawer-content :native-scrollbar="false">
      <template #header>
        <h5>{{ $t('dashboard.apiKey.update') }}</h5>
      </template>
      <FormApiKey :id="currentRow.id" @submit-success="drawerUpdateApiKeyVisible = false" />
    </n-drawer-content>
  </n-drawer>

  <!-- Modal - Delete API key -->
  <ModalDelete v-model:show="showModalDeleteApiKey" :title="$t('dashboard.apiKey.delete')">
    <FormDelete :id="currentRow?.id" type="apiKey" @submit-success="onApiKeyDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const dataStore = useDataStore();
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
        return h('span', {}, { default: () => dateTimeToDate(row.updateTime) });
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
          {
            options: dropdownOptions,
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
    disabled: dataStore.isProjectUser,
    props: {
      onClick: () => {
        drawerUpdateApiKeyVisible.value = true;
      },
    },
  },
  {
    label: t('general.delete'),
    key: 'delete',
    disabled: dataStore.isProjectUser,
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
