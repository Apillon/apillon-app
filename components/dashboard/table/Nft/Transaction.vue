<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="collectionStore.loading"
    :pagination="pagination"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  transactions: { type: Array<TransactionInterface>, default: [] },
});

const { t } = useI18n();
const collectionStore = useCollectionStore();

const NftTransactionStatus = resolveComponent('NftTransactionStatus');
const NftTransactionType = resolveComponent('NftTransactionType');
const TableLink = resolveComponent('TableLink');

const pagination = reactive({
  page: 1,
  pageSize: PAGINATION_LIMIT,
  showSizePicker: true,
  pageSizes: enumValues(PageSize) as number[],
  prefix({ itemCount }) {
    return t('general.total', { total: itemCount });
  },
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.page = 1;
    pagination.pageSize = pageSize;
  },
});

/** Data: filtered transactions */
const data = computed<Array<TransactionInterface>>(() => {
  return (
    props.transactions.filter(item =>
      JSON.stringify(item).toLocaleLowerCase().includes(collectionStore.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<TransactionInterface> => {
  return [
    {
      key: 'chainId',
      title: t('nft.transaction.chain'),
      minWidth: 120,
      render(row: TransactionInterface) {
        return h('span', {}, { default: () => t(`nft.chain.${row.chainId}`) });
      },
    },
    {
      key: 'transactionHash',
      title: t('nft.transaction.hash'),
      render(row: TransactionInterface) {
        return h(
          TableLink,
          {
            link: transactionLink(row.transactionHash, collectionStore.active.chain || row.chainId),
            text: row.transactionHash,
          },
          ''
        );
      },
    },
    {
      key: 'transactionType',
      title: t('nft.transactionType'),
      render(row: TransactionInterface) {
        return h(NftTransactionType, { transactionType: row.transactionType }, '');
      },
    },
    {
      key: 'transactionStatus',
      title: t('general.status'),
      render(row: TransactionInterface) {
        return h(NftTransactionStatus, { transactionStatus: row.transactionStatus }, '');
      },
    },
  ];
};
const columns = createColumns();
</script>
