<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="settingsStore.embeddedWallets"
    :row-props="rowProps"
  />
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const showModalDeleteApiKey = ref<boolean>(false);
const drawerUpdateApiKeyVisible = ref<boolean>(false);

const createColumns = (): NDataTableColumns<ApiKeyInterface> => {
  return [
    {
      title: t('dashboard.apiKey.apiKey'),
      key: 'apiKey',
    },
    {
      title: t('dashboard.name'),
      key: 'name',
    },
    {
      title: t('dashboard.oasisSignatures'),
      key: 'oasisSignatures',
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
    label: t('general.edit'),
    key: 'edit',
    disabled: dataStore.isProjectUser,
    props: {
      onClick: () => {
        router.push(`/dashboard/service/embedded-wallet/${currentRow.value.apiKey}`);
      },
    },
  },
  {
    label: t('general.delete'),
    key: 'delete',
    disabled: dataStore.isProjectUser,
    props: {
      class: '!text-pink',
      onClick: () => {
        showModalDeleteApiKey.value = true;
      },
    },
  },
];
</script>
