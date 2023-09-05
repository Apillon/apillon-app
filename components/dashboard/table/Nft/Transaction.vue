<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="collectionStore.loading"
    :pagination="{ pageSize: PAGINATION_LIMIT }"
    :row-key="rowKey"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  transactions: { type: Array<TransactionInterface>, default: [] },
});

const $i18n = useI18n();
const collectionStore = useCollectionStore();
const { transactionLink } = useNft();

const NftTransactionStatus = resolveComponent('NftTransactionStatus');
const NftTransactionType = resolveComponent('NftTransactionType');
const TableLink = resolveComponent('TableLink');

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
      title: $i18n.t('nft.transaction.chain'),
      minWidth: 120,
      render(row: TransactionInterface) {
        return h('span', {}, { default: () => $i18n.t(`nft.chain.${row.chainId}`) });
      },
    },
    {
      key: 'transactionHash',
      title: $i18n.t('nft.transaction.hash'),
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
      title: $i18n.t('nft.transactionType'),
      render(row: TransactionInterface) {
        return h(NftTransactionType, { transactionType: row.transactionType }, '');
      },
    },
    {
      key: 'transactionStatus',
      title: $i18n.t('general.status'),
      render(row: TransactionInterface) {
        return h(NftTransactionStatus, { transactionStatus: row.transactionStatus }, '');
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: TransactionInterface) => row.id;
</script>
