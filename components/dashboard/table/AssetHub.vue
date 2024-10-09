<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="assetHubStore.loading"
    :expanded-row-keys="expandedRows"
    :pagination="{
      ...assetHubStore.pagination,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
    :row-key="rowKey"
    :row-props="rowProps"
  />
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();
const assetHubStore = useAssetHubStore();

const currentRow = ref<AssetInterface | null>(null);
const expandedRows = ref<Array<string | number>>([]);
const rowKey = (row: AssetInterface) => row.id;

const columns = computed<NDataTableColumns<AssetInterface>>(() => {
  return [
    {
      key: 'name',
      title: t('form.label.assetHub.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'symbol',
      title: t('form.label.assetHub.symbol'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'decimals',
      title: t('form.label.assetHub.decimals'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'supply',
      title: t('form.label.assetHub.initialSupply'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'minBalance',
      title: t('form.label.assetHub.minBalance'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'deposit',
      title: t('form.label.assetHub.deposit'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'owner',
      title: t('form.label.assetHub.owner'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row: AssetInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.owner }, '');
      },
    },
    {
      key: 'admin',
      title: t('form.label.assetHub.admin'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row: AssetInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.admin }, '');
      },
    },
    {
      key: 'issuer',
      title: t('form.label.assetHub.issuerAddress'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row: AssetInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.issuer }, '');
      },
    },
    {
      key: 'freezer',
      title: t('form.label.assetHub.freezerAddress'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row: AssetInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.freezer }, '');
      },
    },
    {
      key: 'status',
      title: t('general.status'),
      render(row) {
        return row.status;
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      className: '!py-0 !sticky right-0',
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
});

/** Data: filtered files */
const data = computed<AssetInterface[]>(() => {
  return (
    assetHubStore.items.filter(item =>
      item.name.toLocaleLowerCase().includes(assetHubStore.search.toLocaleLowerCase())
    ) || []
  );
});

/** On row click */
const rowProps = (row: AssetInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push(`/dashboard/service/asset-hub/${row.id}`);
      }
    },
  };
};

/**
 * Dropdown Actions
 */
const dropdownOptions = [
  {
    key: 'view',
    label: t('dashboard.service.assetHub.select'),
    props: {
      onClick: () => {
        router.push(`/dashboard/service/asset-hub/${currentRow.value?.id}`);
      },
    },
  },
];

onMounted(() => {});
</script>
