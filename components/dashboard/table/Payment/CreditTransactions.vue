<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="paymentStore.creditTransactions.items"
    :loading="loading"
    :pagination="pagination"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const paymentStore = usePaymentStore();

const loading = ref<boolean>(false);

/** Pagination data */
const pagination = reactive({
  page: 1,
  pageSize: PAGINATION_LIMIT,
  showSizePicker: true,
  pageSizes: [10, PAGINATION_LIMIT, 50],
  itemCount: paymentStore.creditTransactions.total,
  onChange: (page: number) => {
    pagination.page = page;
    handlePageChange(page, pagination.pageSize);
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.page = 1;
    pagination.pageSize = pageSize;
    handlePageChange(pagination.page, pageSize);
  },
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
        return h('span', { class: 'text-body' }, `${formatCredits(row.amount)}`);
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
async function handlePageChange(page: number, pageSize: number) {
  if (!loading.value) {
    await paymentStore.fetchCreditTransactions(page, pageSize);
  }
}
</script>
