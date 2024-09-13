<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="settingsStore.loadingWallet"
    :row-props="rowProps"
  />
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();

/** Data: filtered contracts */
const data = computed<Array<EmbeddedWalletInterface>>(() => {
  return (
    settingsStore.embeddedWallets.filter(item =>
      item.name.toLocaleLowerCase().includes(settingsStore.searchWallet.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<EmbeddedWalletInterface> => {
  return [
    {
      key: 'apiKey',
      title: t('dashboard.apiKey.apiKey'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'name',
      title: t('dashboard.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'oasisSignatures',
      title: t('dashboard.oasisSignatures'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
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

const currentRow = ref<EmbeddedWalletInterface>({} as EmbeddedWalletInterface);
const columns = createColumns();

function rowProps(row: EmbeddedWalletInterface) {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/embedded-wallet/${row.apiKey}` });
      }
    },
  };
}

/**
 * Dropdown Actions
 */
const dropdownOptions = [
  {
    key: 'view',
    label: t('general.view'),
    disabled: dataStore.isProjectUser,
    props: {
      onClick: () => {
        router.push(`/dashboard/service/embedded-wallet/${currentRow.value.apiKey}`);
      },
    },
  },
  // {
  //   label: t('general.delete'),
  //   key: 'delete',
  //   disabled: dataStore.isProjectUser,
  //   props: {
  //     class: '!text-pink',
  //     onClick: () => {
  //     },
  //   },
  // },
];
</script>
