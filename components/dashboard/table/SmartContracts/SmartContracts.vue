<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="contracts"
    :loading="deployedContractStore.loading"
    :pagination="deployedContractStore.pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page="
      (page: number) => handlePageChange(page, deployedContractStore.pagination.pageSize)
    "
    @update:page-size="(pageSize: number) => handlePageChange(1, pageSize)"
    remote
  />
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import { NButton, NDropdown } from 'naive-ui';

const props = defineProps({
  contracts: { type: Array<DeployedContractInterface>, default: [] },
});

const { t } = useI18n();
const router = useRouter();
const deployedContractStore = useDeployedContractStore();

const rowKey = (row: DeployedContractInterface) => row.contract_uuid;
const currentRow = ref<DeployedContractInterface>(props.contracts[0]);

const availableColumns = ref([
  { value: 'name', label: t('dashboard.service.smartContracts.table.name') },
  { value: 'chain', label: t('dashboard.service.smartContracts.table.chain') },
  { value: 'contractAddress', label: t('dashboard.service.smartContracts.table.contractAddress') },
  { value: 'description', label: t('general.description') },
  { value: 'contractStatus', label: t('dashboard.service.smartContracts.table.contractStatus') },
]);
const selectedColumns = ref(['name', 'chain', 'contractAddress', 'description', 'contractStatus']);

const columns = computed(() => [
  {
    key: 'name',
    title: t('dashboard.service.smartContracts.table.name'),
    className: [ON_COLUMN_CLICK_OPEN_CLASS, { hidden: !selectedColumns.value.includes('name') }],
    render(row: DeployedContractInterface) {
      return h('strong', {}, { default: () => row.name });
    },
  },
  {
    key: 'chain',
    title: t('dashboard.service.smartContracts.table.chain'),
    className: [ON_COLUMN_CLICK_OPEN_CLASS, { hidden: !selectedColumns.value.includes('chain') }],
    minWidth: 120,
    render(row: DeployedContractInterface) {
      return h('span', {}, { default: () => t(`nft.chain.${row.chain}`) });
    },
  },
  {
    key: 'contractAddress',
    title: t('dashboard.service.smartContracts.table.contractAddress'),
    minWidth: 100,
    className: { hidden: !selectedColumns.value.includes('contractAddress') },
    render(row: DeployedContractInterface) {
      return h(
        resolveComponent('TableLink'),
        { link: contractLink(row.contractAddress, row.chain), text: row.contractAddress },
        ''
      );
    },
  },
  {
    key: 'description',
    title: t('general.description'),
    className: [
      ON_COLUMN_CLICK_OPEN_CLASS,
      { hidden: !selectedColumns.value.includes('description') },
    ],
  },
  {
    key: 'contractStatus',
    title: t('dashboard.service.smartContracts.table.contractStatus'),
    className: { hidden: !selectedColumns.value.includes('contractStatus') },
    render(row: DeployedContractInterface) {
      return h(
        resolveComponent('SmartContractsStatusLabel'),
        { contractStatus: row.contractStatus },
        ''
      );
    },
  },
  {
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
]);
/** On row click */
const rowProps = (row: DeployedContractInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;
      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/smart-contracts/deployed/${row.contract_uuid}` });
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
    label: t('general.view'),
    props: {
      onClick: () => {
        router.push({
          path: `/dashboard/service/smart-contracts/deployed/${currentRow.value.contract_uuid}`,
        });
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

/** Search posts */
watch(
  () => deployedContractStore.search,
  _ => {
    deployedContractStore.loading = true;
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = useDebounceFn(handlePageChange, 500);

async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {
  await deployedContractStore.fetchDeployedContracts(page, limit);
  deployedContractStore.pagination.page = page;
  deployedContractStore.pagination.pageSize = limit;
}

function handleColumnChange(selectedValues: Array<string>) {
  selectedColumns.value = selectedValues;
  localStorage.setItem(LsTableColumnsKeys.ASSET_HUB, JSON.stringify(selectedColumns.value));
}
</script>
