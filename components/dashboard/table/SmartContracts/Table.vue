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
        pageSize: PAGINATION_LIMIT,
        prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
      }"
      :row-key="rowKey"
      :row-props="rowProps"
    />
  </n-space>
</template>

<script lang="ts" setup>
const router = useRouter();

const { t } = useI18n();
const smartContractsStore = useSmartContractsStore();

const props = defineProps({
  contracts: { type: Array<CollectionInterface>, default: [] },
});

const data = computed<Array<SmartContractInterface>>(() => {
  return (
    props.contracts.filter(item =>
      item.name.toLocaleLowerCase().includes(smartContractsStore.search.toLocaleLowerCase())
    ) || []
  );
});

const selectedColumns = ref<string[]>(['chain', 'name', 'contractAddress', 'contractStatus']);
const rowKey = (row: SmartContractInterface) => row.contract_uuid;
const currentRow = ref<SmartContractInterface>(props.contracts[0]);

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
      return h('span', {}, { default: () => row.chain });
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
    minWidth: 100,
    className: [
      ON_COLUMN_CLICK_OPEN_CLASS,
      { hidden: !selectedColumns.value.includes('contractStatus') },
    ],
    render(row) {
      return h('span', {}, { default: () => row.contractStatus });
    },
  },
]);

/** On row click */
const rowProps = (row: SmartContractInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;
      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/smart-contracts/deployed/${row.contract_uuid}` });
      }
    },
  };
};
</script>
