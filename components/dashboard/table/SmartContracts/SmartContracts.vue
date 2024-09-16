<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="props.contracts"
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

const props = defineProps({
  contracts: { type: Array<DeployedContractInterface>, default: [] },
});

const { t } = useI18n();
const router = useRouter();
const deployedContractStore = useDeployedContractStore();

const rowKey = (row: DeployedContractInterface) => row.contract_uuid;
const currentRow = ref<DeployedContractInterface>(props.contracts[0]);

const columns = computed(() => [
  {
    key: 'name',
    title: t('dashboard.service.smartContracts.table.name'),
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    render(row) {
      return h('strong', {}, { default: () => row.name });
    },
  },
  {
    key: 'chain',
    title: t('dashboard.service.smartContracts.table.chain'),
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    minWidth: 120,
    render(row) {
      return h('span', {}, { default: () => t(`nft.chain.${row.chain}`) });
    },
  },
  {
    key: 'contractAddress',
    title: t('dashboard.service.smartContracts.table.contractAddress'),
    minWidth: 100,
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    render(row) {
      return h('span', {}, { default: () => row.contractAddress });
    },
  },
  {
    key: 'contractStatus',
    title: t('dashboard.service.smartContracts.table.contractStatus'),
    render(row) {
      return h(
        resolveComponent('SmartContractsStatusLabel'),
        { contractStatus: row.contractStatus },
        ''
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
</script>
