<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="paymentsStore.invoices.items"
    :loading="loading"
    :pagination="pagination"
    @update:page="handlePageChange"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const paymentsStore = usePaymentsStore();

const loading = ref<boolean>(false);

/** Pagination data */
const currentPage = ref<number>(1);
const pagination = computed(() => {
  return {
    page: currentPage.value,
    pageSize: PAGINATION_LIMIT,
    pageCount: Math.ceil(paymentsStore.invoices.total / PAGINATION_LIMIT),
    itemCount: paymentsStore.invoices.total,
  };
});

const createColumns = (): NDataTableColumns<InvoiceInterface> => {
  return [
    {
      title: t('dashboard.invoice.client'),
      key: 'invoice',
      render(row) {
        return [
          h('strong', { class: 'block' }, row.clientName),
          h('span', { class: 'text-body text-xs' }, row.clientEmail),
        ];
      },
    },
    {
      title: t('dashboard.invoice.subtotalAmount'),
      key: 'subtotalAmount',
      render(row) {
        return h(
          'span',
          { class: 'text-body' },
          `${row.subtotalAmount} ${formatCurrency(row.currency)}`
        );
      },
    },
    {
      title: t('dashboard.invoice.totalAmount'),
      key: 'totalAmount',
      render(row) {
        return h(
          'span',
          { class: 'text-body' },
          `${row.totalAmount} ${formatCurrency(row.currency)}`
        );
      },
    },
    {
      title: t('dashboard.invoice.referenceTable'),
      key: 'referenceTable',
      render(row) {
        return h('span', { class: 'text-body' }, `${row.referenceTable}`);
      },
    },
    {
      title: t('dashboard.invoice.date'),
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
    await paymentsStore.fetchInvoices(page, PAGINATION_LIMIT);
    currentPage.value = page;
  }
}

const formatCurrency = (currency: string) => (currency === 'eur' ? '€' : '$');
</script>
