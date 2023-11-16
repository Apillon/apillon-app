<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="paymentStore.invoices.items"
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
  itemCount: paymentStore.invoices.total,
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
          `${formatPrice(row.subtotalAmount, row.currency)}`
        );
      },
    },
    {
      title: t('dashboard.invoice.totalAmount'),
      key: 'totalAmount',
      render(row) {
        return h('span', { class: 'text-body' }, `${formatPrice(row.totalAmount, row.currency)}`);
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
async function handlePageChange(page: number, pageSize: number) {
  if (!loading.value) {
    await paymentStore.getInvoices(page, pageSize);
  }
}
</script>
