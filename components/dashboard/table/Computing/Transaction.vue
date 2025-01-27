<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="transactionStore.items"
    :loading="transactionStore.loading"
    :pagination="transactionStore.pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page="(page: number) => handlePageChange(page, transactionStore.pagination.pageSize)"
    @update:page-size="
      (pageSize: number) => handlePageChange(transactionStore.pagination.page, pageSize)
    "
    remote
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  contractUuid: { type: String, required: true },
});

const $i18n = useI18n();
const transactionStore = useComputingTransactionStore();

const createColumns = (): NDataTableColumns<TransactionInterface> => {
  return [
    {
      key: 'transactionHash',
      title: $i18n.t('computing.transaction.hash'),
      render(row: TransactionInterface) {
        return h(
          resolveComponent('TableLink'),
          {
            text: row.transactionHash,
            link: transactionLink(row.transactionHash, SubstrateChain.PHALA),
          },
          ''
        );
      },
    },
    {
      key: 'transactionType',
      title: $i18n.t('computing.transaction.transactionType'),
      render(row: TransactionInterface) {
        return h(
          resolveComponent('ComputingTransactionType'),
          { transactionType: row.transactionType },
          ''
        );
      },
    },
    {
      key: 'transactionStatus',
      title: $i18n.t('general.status'),
      render(row: TransactionInterface) {
        return h(
          resolveComponent('ComputingTransactionStatus'),
          { transactionStatus: row.transactionStatus },
          ''
        );
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: TransactionInterface) => row.id;
const currentRow = ref<TransactionInterface>({} as TransactionInterface);

function rowProps(row: TransactionInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

/** On page change, load data */
async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {
  if (!transactionStore.loading) {
    await transactionStore.fetchTransactions(props.contractUuid, { page, limit });
  }
}
</script>
