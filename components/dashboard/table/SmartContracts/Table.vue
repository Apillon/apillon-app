<template>
  <n-space class="pb-8" :size="32" vertical>
    <ActionsSmartContractsActions />

    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="data"
      :pagination="{
        onChange: (page: number) => {
          handlePageChange(page, smartContractStore.pagination.pageSize);
        },
        onUpdatePageSize: (pageSize: number) => {
          handlePageChange(1, pageSize);
        },
      }"
      :row-key="rowKey"
      :row-props="rowProps"
    />
  </n-space>
</template>

<script lang="ts" setup>
const router = useRouter();

const { t } = useI18n();
const smartContractStore = useSmartContractStore();

const props = defineProps({
  contracts: { type: Array<DeployedContractInterface>, default: [] },
});

const data = computed<Array<DeployedContractInterface>>(() => {
  return (
    props.contracts.filter(item =>
      item.name.toLocaleLowerCase().includes(smartContractStore.search.toLocaleLowerCase())
    ) || []
  );
});

const DeployStatus = resolveComponent('SmartContractsStatusLabel');

const selectedColumns = ref<string[]>(['chain', 'name', 'contractAddress', 'contractStatus']);

const rowKey = (row: DeployedContractInterface) => row.contract_uuid;
const currentRow = ref<DeployedContractInterface>(props.contracts[0]);

const columns = computed(() => [
  {
    key: 'name',
    title: t('dashboard.service.smartContracts.table.name'),
    className: [ON_COLUMN_CLICK_OPEN_CLASS, { hidden: !selectedColumns.value.includes('name') }],
    render(row) {
      return h('strong', {}, { default: () => row.name });
    },
  },
  {
    key: 'chain',
    title: t('dashboard.service.smartContracts.table.chain'),
    className: [ON_COLUMN_CLICK_OPEN_CLASS, { hidden: !selectedColumns.value.includes('name') }],
    minWidth: 120,
    render(row) {
      return h(
        'span',
        {},
        { default: () => t(`dashboard.service.smartContracts.chain.${row.chain}`) }
      );
    },
  },
  {
    key: 'contractAddress',
    title: t('dashboard.service.smartContracts.table.contractAddress'),
    minWidth: 100,
    className: [
      ON_COLUMN_CLICK_OPEN_CLASS,
      { hidden: !selectedColumns.value.includes('contractAddress') },
    ],
    render(row) {
      return h('span', {}, { default: () => row.contractAddress });
    },
  },
  {
    key: 'contractStatus',
    title: t('dashboard.service.smartContracts.table.contractStatus'),
    render(row) {
      return h(DeployStatus, { contractStatus: row.contractStatus }, '');
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

//
async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {}
</script>
