<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="assetHubStore.loading"
    :pagination="createPagination(false)"
    :row-key="rowKey"
    :row-props="rowProps"
  />

  <!-- Modal - Edit asst -->
  <modal v-model:show="modalEditVisible" :title="$t('dashboard.service.assetHub.edit')">
    <FormAssetHub
      v-if="currentRow?.id"
      :asset-id="currentRow?.id"
      @close="modalEditVisible = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const props = defineProps({
  owned: { type: Boolean, default: false },
});
const { t } = useI18n();
const router = useRouter();
const assetHubStore = useAssetHubStore();
const { selectedColumns } = useAssetHub();

const modalEditVisible = ref<boolean>(false);
const currentRow = ref<AssetInterface | null>(null);
const rowKey = (row: AssetInterface) => row.id;

const availableColumns = ref([
  { value: 'id', label: t('form.label.assetHub.assetId') },
  { value: 'name', label: t('form.label.assetHub.name') },
  { value: 'symbol', label: t('form.label.assetHub.symbol') },
  { value: 'decimals', label: t('form.label.assetHub.decimals') },
  { value: 'supply', label: t('form.label.assetHub.initialSupply') },
  { value: 'minBalance', label: t('form.label.assetHub.minBalance') },
  { value: 'deposit', label: t('form.label.assetHub.deposit') },
  { value: 'owner', label: t('form.label.assetHub.owner') },
  { value: 'admin', label: t('form.label.assetHub.admin') },
  { value: 'issuer', label: t('form.label.assetHub.issuerAddress') },
  { value: 'freezer', label: t('form.label.assetHub.freezerAddress') },
  { value: 'status', label: t('general.status') },
]);

const columns = computed<NDataTableColumns<AssetInterface>>(() => {
  return [
    {
      key: 'id',
      title: t('form.label.assetHub.assetId'),
      className: [
        { hidden: !selectedColumns.value.includes('id') },
        { [ON_COLUMN_CLICK_OPEN_CLASS]: props.owned },
      ],
    },
    {
      key: 'name',
      title: t('form.label.assetHub.name'),
      className: [
        { hidden: !selectedColumns.value.includes('name') },
        { [ON_COLUMN_CLICK_OPEN_CLASS]: props.owned },
      ],
    },
    {
      key: 'symbol',
      title: t('form.label.assetHub.symbol'),
      className: [
        { hidden: !selectedColumns.value.includes('symbol') },
        { [ON_COLUMN_CLICK_OPEN_CLASS]: props.owned },
      ],
    },
    {
      key: 'decimals',
      title: t('form.label.assetHub.decimals'),
      className: [
        { hidden: !selectedColumns.value.includes('decimals') },
        { [ON_COLUMN_CLICK_OPEN_CLASS]: props.owned },
      ],
    },
    {
      key: 'supply',
      title: t('form.label.assetHub.initialSupply'),
      className: [
        { hidden: !selectedColumns.value.includes('supply') },
        { [ON_COLUMN_CLICK_OPEN_CLASS]: props.owned },
      ],
    },
    {
      key: 'minBalance',
      title: t('form.label.assetHub.minBalance'),
      className: [
        { hidden: !selectedColumns.value.includes('minBalance') },
        { [ON_COLUMN_CLICK_OPEN_CLASS]: props.owned },
      ],
    },
    {
      key: 'deposit',
      title: t('form.label.assetHub.deposit'),
      className: [
        { hidden: !selectedColumns.value.includes('deposit') },
        { [ON_COLUMN_CLICK_OPEN_CLASS]: props.owned },
      ],
    },
    {
      key: 'owner',
      title: t('form.label.assetHub.owner'),
      className: [
        { hidden: !selectedColumns.value.includes('owner') },
        { [ON_COLUMN_CLICK_OPEN_CLASS]: props.owned },
      ],
      render(row: AssetInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.owner }, '');
      },
    },
    {
      key: 'admin',
      title: t('form.label.assetHub.admin'),
      className: [
        { hidden: !selectedColumns.value.includes('admin') },
        { [ON_COLUMN_CLICK_OPEN_CLASS]: props.owned },
      ],
      render(row: AssetInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.admin }, '');
      },
    },
    {
      key: 'issuer',
      title: t('form.label.assetHub.issuerAddress'),
      className: [
        { hidden: !selectedColumns.value.includes('issuerAddress') },
        { [ON_COLUMN_CLICK_OPEN_CLASS]: props.owned },
      ],
      render(row: AssetInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.issuer }, '');
      },
    },
    {
      key: 'freezer',
      title: t('form.label.assetHub.freezerAddress'),
      className: [
        { hidden: !selectedColumns.value.includes('freezerAddress') },
        { [ON_COLUMN_CLICK_OPEN_CLASS]: props.owned },
      ],
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
      className: ['!py-0 !sticky right-0', { hidden: !props.owned }],
      filter: 'default',
      filterOptionValue: null,
      renderFilterIcon: () => {
        return h('span', { class: 'icon-more' }, '');
      },
      renderFilterMenu: () => {
        return h(
          resolveComponent('TableColumns'),
          {
            model: selectedColumns.value,
            columns: availableColumns.value,
            onColumnChange: handleColumnChange,
          },
          ''
        );
      },
      render() {
        if (props.owned) {
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
        }
      },
    },
  ];
});

/** Data: filtered files */
const data = computed<AssetInterface[]>(() => {
  if (props.owned) {
    return assetHubStore.items.filter(item => item.owner === assetHubStore.account?.address);
  }
  return assetHubStore.items.filter(
    item =>
      item.owner !== assetHubStore.account?.address &&
      item.name.toLocaleLowerCase().includes(assetHubStore.search.toLocaleLowerCase())
  );
});

/** On row click */
const rowProps = (row: AssetInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath()) && props.owned) {
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
        if (props.owned) {
          router.push(`/dashboard/service/asset-hub/${currentRow.value?.id}`);
        }
      },
    },
  },
  {
    key: 'edit',
    label: t('dashboard.service.assetHub.edit'),
    props: {
      onClick: () => {
        if (props.owned) {
          modalEditVisible.value = true;
        }
      },
    },
  },
];

onMounted(() => {
  /** Check if selected columns are stored in LS */
  if (localStorage.getItem(LsTableColumnsKeys.ASSET_HUB)) {
    selectedColumns.value = JSON.parse(localStorage.getItem(LsTableColumnsKeys.ASSET_HUB) || '');
  }
});

function handleColumnChange(selectedValues: Array<string>) {
  selectedColumns.value = selectedValues;
  localStorage.setItem(LsTableColumnsKeys.ASSET_HUB, JSON.stringify(selectedColumns.value));
}
</script>
