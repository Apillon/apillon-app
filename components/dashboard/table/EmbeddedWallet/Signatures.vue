<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="embeddedWalletStore.signature.items"
    :loading="embeddedWalletStore.signature.loading"
    :pagination="embeddedWalletStore.signature.pagination"
    :row-key="rowKey"
    remote
    @update:page="(page: number) => handlePageChange(page, embeddedWalletStore.signature.pagination.pageSize)"
    @update:page-size="(pageSize: number) => handlePageChange(embeddedWalletStore.signature.pagination.page, pageSize)"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { tableRowCreateTime } = useTable();
const embeddedWalletStore = useEmbeddedWalletStore();

const createColumns = (): NDataTableColumns<SignatureInterface> => {
  return [
    {
      key: 'publicAddress',
      title: t('embeddedWallet.table.publicAddress'),
      render(row: SignatureInterface) {
        return h(resolveComponent('TableEllipsis'), {
          text: row.publicAddress,
          color: 'text-white',
        });
      },
    },
    {
      key: 'contractAddress',
      title: t('embeddedWallet.table.contractAddress'),
      render(row: SignatureInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.contractAddress });
      },
    },
    // {
    //   key: 'hashedUsername',
    //   title: t('embeddedWallet.table.hashedUsername'),
    //   render(row) {
    //     return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.hashedUsername });
    //   },
    // },
    tableRowCreateTime,
    {
      title: t('general.status'),
      key: 'created',
      render(row: SignatureInterface) {
        return h(
          resolveComponent('pill'),
          { type: row.status === 5 ? 'success' : 'warning' },
          { default: () => SqlModelStatus[row.status] }
        );
      },
    },
  ];
};

const rowKey = (row: SignatureInterface) => row.apiKey;
const columns = createColumns();

/** On page change, load data */
async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {
  if (!embeddedWalletStore.signature.loading) {
    await embeddedWalletStore.fetchSignatures(embeddedWalletStore.integrationUuid, page, limit);

    embeddedWalletStore.signature.pagination.page = page;
    embeddedWalletStore.signature.pagination.pageSize = limit;
  }
}
</script>
