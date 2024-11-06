<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="assetHubStore.loading && (!owned || !assetHubStore.search)"
    :pagination="pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page-size="(pz: number) => (pagination.pageSize = pz)"
  />

  <!-- Modal - Edit asst -->
  <modal v-model:show="modalEditVisible" :title="$t('dashboard.service.assetHub.edit')">
    <FormAssetHub
      v-if="currentRow?.id"
      :asset-id="currentRow.id"
      @submit-success="refreshAsset(currentRow.id)"
      @close="modalEditVisible = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import { NButton, NDropdown } from 'naive-ui';

const props = defineProps({
  owned: { type: Boolean, default: false },
});
const { t } = useI18n();
const router = useRouter();
const assetHubStore = useAssetHubStore();
const { selectedColumns, refreshAsset } = useAssetHub();

const modalEditVisible = ref<boolean>(false);
const currentRow = ref<AssetInterface | null>(null);
const rowKey = (row: AssetInterface) => row.id;
const pagination = reactive(createPagination(false));

const availableColumns = ref([
  { value: 'id', label: t('form.label.assetHub.id') },
  { value: 'name', label: t('form.label.assetHub.name') },
  { value: 'symbol', label: t('form.label.assetHub.symbol') },
  { value: 'decimals', label: t('form.label.assetHub.decimals') },
  { value: 'supply', label: t('form.label.assetHub.supply') },
  { value: 'minBalance', label: t('form.label.assetHub.minBalance') },
  { value: 'deposit', label: t('form.label.assetHub.deposit') },
  { value: 'owner', label: t('form.label.assetHub.owner') },
  { value: 'admin', label: t('form.label.assetHub.admin') },
  { value: 'issuer', label: t('form.label.assetHub.issuer') },
  { value: 'freezer', label: t('form.label.assetHub.freezer') },
  { value: 'status', label: t('general.status') },
]);

/** */
const columns = computed<NDataTableColumns<AssetInterface>>(() => {
  const cols: NDataTableColumns<AssetInterface> = [];

  availableColumns.value.forEach(col => {
    if (selectedColumns.value.includes(col.value)) {
      if (['owner', 'admin', 'issuer', 'freezer'].includes(col.value)) {
        if (props.owned) {
          cols.push({
            key: col.value,
            sorter: 'default',
            title: t(`form.label.assetHub.${col.value}`),
            className: props.owned ? ON_COLUMN_CLICK_OPEN_CLASS : '',
            render(row: AssetInterface) {
              return h(resolveComponent('TableEllipsis'), { text: row[col.value] }, '');
            },
          });
        }
      } else {
        cols.push({
          key: col.value,
          sorter: 'default',
          title: t(`form.label.assetHub.${col.value}`),
          className: props.owned ? ON_COLUMN_CLICK_OPEN_CLASS : '',
        });
      }
    }
  });

  if (props.owned) {
    cols.push({
      key: 'actions',
      title: '',
      align: 'right',
      className: '!py-0 !sticky right-0',
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
    });
  }
  return cols;
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

const data = ref<AssetInterface[]>([]);
const otherAssets = ref<AssetInterface[]>([]);
const getOwnedAssets = () =>
  assetHubStore.items.filter(item => item.owner === assetHubStore.account?.address);
const getOtherAssets = () =>
  assetHubStore.items.filter(item => item.owner !== assetHubStore.account?.address);
const searchAssets = () => {
  data.value = otherAssets.value.filter(item =>
    (item.id + '' + item.name + '' + item.symbol)
      .toLowerCase()
      .includes(assetHubStore.search.toLowerCase())
  );
  assetHubStore.loading = false;
};

onMounted(() => {
  /** Check if selected columns are stored in LS */
  if (localStorage.getItem(LsTableColumnsKeys.ASSET_HUB)) {
    selectedColumns.value = JSON.parse(localStorage.getItem(LsTableColumnsKeys.ASSET_HUB) || '');
  }
  initAsset();
});

watch(
  () => assetHubStore.mainnet,
  async () => {
    initAsset();
  }
);
watch(
  () => assetHubStore.search,
  search => {
    if (!props.owned) {
      if (search) {
        assetHubStore.loading = true;
        debouncedSearchFilter();
      } else {
        data.value = otherAssets.value;
        assetHubStore.loading = false;
      }
    }
  }
);
const debouncedSearchFilter = useDebounceFn(searchAssets, 500);

function initAsset() {
  assetHubStore.search = '';
  otherAssets.value = getOtherAssets();
  data.value = props.owned ? getOwnedAssets() : otherAssets.value;
}

function handleColumnChange(selectedValues: Array<string>) {
  selectedColumns.value = selectedValues;
  localStorage.setItem(LsTableColumnsKeys.ASSET_HUB, JSON.stringify(selectedColumns.value));
}
</script>
