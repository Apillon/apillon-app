<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="embeddedWalletStore.signature.items"
    :loading="embeddedWalletStore.signature.loading"
    :pagination="embeddedWalletStore.signature.pagination"
    :row-key="rowKey"
    remote
    @update:page="
      (page: number) => handlePageChange(page, embeddedWalletStore.signature.pagination.pageSize)
    "
    @update:page-size="
      (pageSize: number) =>
        handlePageChange(embeddedWalletStore.signature.pagination.page, pageSize)
    "
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();
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
      key: 'dataHash',
      title: t('embeddedWallet.table.dataHash'),
      render(row) {
        return h(resolveComponent('TableEllipsis'), { text: row.dataHash });
      },
    },
    // {
    //   key: 'hashedUsername',
    //   title: t('embeddedWallet.table.hashedUsername'),
    //   render(row) {
    //     return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.hashedUsername });
    //   },
    // },
    {
      key: 'createTime',
      title: t('dashboard.created'),
      minWidth: 120,
      render(row) {
        return dateTimeToDate(row?.createTime || '');
      },
    },
    {
      title: t('general.status'),
      key: 'created',
      render(row: SignatureInterface) {
        return h(
          resolveComponent('pill'),
          { type: 'info' },
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
