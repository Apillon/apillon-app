<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="paymentStore.creditTransactions.items"
    :loading="loading"
    :pagination="pagination"
    @update:page="handlePageChange"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const paymentStore = usePaymentStore();

const loading = ref<boolean>(false);

/** Pagination data */
const currentPage = ref<number>(1);
const pagination = computed(() => {
  return {
    page: currentPage.value,
    pageSize: PAGINATION_LIMIT,
    pageSizes: [PAGINATION_LIMIT, 50, 100],
    pageCount: Math.ceil(paymentStore.invoices.total / PAGINATION_LIMIT),
    itemCount: paymentStore.invoices.total,
  };
});

const createColumns = (): NDataTableColumns<CreditTransactionInterface> => {
  return [
    {
      title: t('dashboard.credits.service'),
      key: 'service',
      render(row) {
        return h('span', { class: 'text-body' }, row.service);
      },
    },
    {
      title: t('dashboard.credits.category'),
      key: 'category',
      render(row) {
        return h('span', { class: 'text-body' }, row.category);
      },
    },
    {
      title: t('dashboard.credits.description'),
      key: 'description',
      render(row) {
        return h('span', { class: 'text-body' }, row.description);
      },
    },
    {
      title: t('dashboard.credits.direction'),
      key: 'direction',
      render(row) {
        return h('span', { class: 'text-body' }, row.direction === 1 ? 'RECEIVE' : 'SPEND');
      },
    },
    {
      title: t('dashboard.credits.amount'),
      key: 'amount',
      render(row) {
        return h('span', { class: 'text-body' }, `${formatNumber(row.amount)}`);
      },
    },
    {
      title: t('dashboard.credits.date'),
      key: 'createTime',
      render(row) {
        return h('span', { class: 'text-body' }, dateTimeToDateAndTime(row?.createTime || ''));
      },
    },
  ];
};

const columns = createColumns();

/** On page change, load data */
async function handlePageChange(page: number) {
  if (!loading.value) {
    await paymentStore.fetchCreditTransactions(page, PAGINATION_LIMIT);
    currentPage.value = page;
  }
}
</script>
