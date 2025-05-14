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
  <modal v-model:show="modalEditVisible" :title="$t('assetHub.edit')">
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
import { NDropdown } from 'naive-ui';

const props = defineProps({
  owned: { type: Boolean, default: false },
});
const { t } = useI18n();
const router = useRouter();
const assetHubStore = useAssetHubStore();
const { refreshAsset } = useAssetHub();
const { availableColumns, selectedColumns, initTableColumns, handleColumnChange } = useTable(
  LsTableColumnsKeys.ASSET_HUB
);

const modalEditVisible = ref<boolean>(false);
const currentRow = ref<AssetInterface | null>(null);
const rowKey = (row: AssetInterface) => row.id;
const pagination = reactive(createPagination(false));

const allColumns = [
  'id',
  'name',
  'symbol',
  'decimals',
  'supply',
  'minBalance',
  'deposit',
  'owner',
  'admin',
  'issuer',
  'freezer',
  'status',
];

const isOnlyOwnerColumn = (key: string) => ['owner', 'admin', 'issuer', 'freezer'].includes(key);

/** */
const columns = computed<NDataTableColumns<AssetInterface>>(() => {
  const cols: NDataTableColumns<AssetInterface> = [];

  allColumns.forEach(key => {
    if (!selectedColumns.value.includes(key)) return;
    if (isOnlyOwnerColumn(key) && !props.owned) return;

    cols.push({
      key,
      sorter: 'default',
      title: t(`form.label.assetHub.${key}`),
      className: props.owned ? ON_COLUMN_CLICK_OPEN_CLASS : '',
      render(row: AssetInterface) {
        if (isOnlyOwnerColumn(key)) {
          return h(resolveComponent('TableEllipsis'), { text: row[key] }, '');
        }
        return row[key];
      },
    });
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
              default: () => h(resolveComponent('BtnActions')),
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
    label: t('assetHub.select'),
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
    label: t('assetHub.edit'),
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
const getOwnedAssets = () => assetHubStore.items.filter(item => item.owner === assetHubStore.account?.address);
const getOtherAssets = () => assetHubStore.items.filter(item => item.owner !== assetHubStore.account?.address);
const searchAssets = () => {
  data.value = otherAssets.value.filter(item =>
    (item.id + '' + item.name + '' + item.symbol).toLowerCase().includes(assetHubStore.search.toLowerCase())
  );
  assetHubStore.loading = false;
};

onMounted(() => {
  initTableColumns(columns.value);
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
</script>
