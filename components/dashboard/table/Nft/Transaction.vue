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
    :row-props="rowProps"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  transactions: { type: Array<TransactionInterface>, default: [] },
});

const $i18n = useI18n();
const router = useRouter();
const collectionStore = useCollectionStore();
const { transactionLink } = useNft();

const NftTransactionStatus = resolveComponent('NftTransactionStatus');
const NftTransactionType = resolveComponent('NftTransactionType');
const TableLink = resolveComponent('TableLink');

/** Data: filtered transactions */
const data = computed<Array<TransactionInterface>>(() => {
  return (
    props.transactions.filter(item =>
      item.updateTime.toLocaleLowerCase().includes(collectionStore.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<TransactionInterface> => {
  return [
    {
      key: 'chainId',
      title: $i18n.t('nft.transaction.chainId'),
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
            link: transactionLink(row.transactionHash, row.chainId || collectionStore.active.chain),
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
    {
      key: 'updateTime',
      title: $i18n.t('general.updateTime'),
      render(row: TransactionInterface) {
        return h('span', {}, { default: () => datetimeToDateAndTime(row.updateTime || '') });
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: TransactionInterface) => row.id;
const currentRow = ref<TransactionInterface>(props.transactions[0]);

/** On row click */
const rowProps = (row: TransactionInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/nft/${row.id}` });
      }
    },
  };
};
</script>
