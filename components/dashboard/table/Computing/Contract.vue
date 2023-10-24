<template>
  <n-space class="pb-8" :size="32" vertical>
    <ActionsComputing />

    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="data"
      :loading="contractStore.loading"
      :pagination="{ pageSize: PAGINATION_LIMIT }"
      :row-key="rowKey"
      :row-props="rowProps"
    />
  </n-space>
</template>

<script lang="ts" setup>
const props = defineProps({
  contracts: { type: Array<ContractInterface>, default: [] },
});

const $i18n = useI18n();
const router = useRouter();
const contractStore = useContractStore();
const TableEllipsis = resolveComponent('TableEllipsis');
const ComputingContractStatus = resolveComponent('ComputingContractStatus');

/** Data: filtered contracts */
const data = computed<Array<ContractInterface>>(() => {
  return (
    props.contracts.filter(item =>
      item.name.toLocaleLowerCase().includes(contractStore.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<ContractInterface> => {
  return [
    {
      key: 'name',
      title: $i18n.t('computing.contract.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'type',
      title: $i18n.t('general.type'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      minWidth: 100,
      render(row) {
        if (row.contractType) {
          return $i18n.t(`computing.contract.type.${row.contractType}`);
        } else {
          return $i18n.t(`computing.contract.type.${ComputingContractType.SCHRODINGER}`);
        }
      },
    },
    {
      key: 'contract_uuid',
      title: $i18n.t('computing.contract.uuid'),
      className: 'hidden',
      render(row: ContractInterface) {
        return h(TableEllipsis, { text: row.contract_uuid }, '');
      },
    },
    {
      key: 'contractAddress',
      title: $i18n.t('computing.contract.contractAddress'),
      render(row: ContractInterface) {
        return h(TableEllipsis, { text: row.contractAddress }, '');
      },
    },
    {
      key: 'contractStatus',
      title: $i18n.t('general.status'),
      render(row) {
        return h(ComputingContractStatus, { contractStatus: row.contractStatus }, '');
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: ContractInterface) => row.contract_uuid;
const currentRow = ref<ContractInterface>(props.contracts[0]);

/** On row click */
const rowProps = (row: ContractInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/computing/${row.contract_uuid}` });
      }
    },
  };
};
</script>
