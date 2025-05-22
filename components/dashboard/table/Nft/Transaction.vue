<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="collectionStore.loading"
    :pagination="pagination"
    @update:page="(page: number) => (pagination.page = page)"
    @update:page-size="
      (pageSize: number) => {
        pagination.page = 1;
        pagination.pageSize = pageSize;
      }
    "
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  transactions: { type: Array<TransactionInterface>, default: [] },
});

const { t, te } = useI18n();
const collectionStore = useCollectionStore();

const pagination = reactive(createPagination(false));

/** Data: filtered transactions */
const data = computed<Array<TransactionInterface>>(() => {
  return (
    props.transactions.filter(item =>
      JSON.stringify(item).toLowerCase().includes(collectionStore.search.toLowerCase())
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
        return h(
          'span',
          {},
          {
            default: () =>
              te(`nft.chain.${EvmChain[row.chainId]}`)
                ? t(`nft.chain.${EvmChain[row.chainId]}`)
                : EvmChain[row.chainId],
          }
        );
      },
    },
    {
      key: 'transactionHash',
      title: t('nft.transaction.hash'),
      render(row: TransactionInterface) {
        return h(
          resolveComponent('TableLink'),
          {
            link: transactionLink(row.transactionHash, collectionStore.active.chain || row.chainId),
            text: truncateWallet(row.transactionHash),
          },
          ''
        );
      },
    },
    {
      key: 'transactionType',
      title: t('nft.transactionType'),
      render(row: TransactionInterface) {
        return h(resolveComponent('NftTransactionType'), { transactionType: row.transactionType }, '');
      },
    },
    {
      key: 'transactionStatus',
      title: t('general.status'),
      render(row: TransactionInterface) {
        return h(resolveComponent('NftTransactionStatus'), { status: row.transactionStatus }, '');
      },
    },
  ];
};
const columns = createColumns();
</script>
