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
  itemCount: paymentStore.invoices.total,
  page: 1,
  pageSize: PAGINATION_LIMIT,
  showSizePicker: paymentStore.invoices.total > 0,
  pageSizes: enumValues(PageSize) as number[],
  prefix({ itemCount }) {
    return t('general.total', { total: itemCount });
  },
  onChange: (page: number) => {
    handlePageChange(page, pagination.pageSize);
  },
  onUpdatePageSize: (pageSize: number) => {
    handlePageChange(1, pageSize);
  },
});

const createColumns = (): NDataTableColumns<InvoiceInterface> => {
  return [
    {
      key: 'invoice',
      title: t('dashboard.invoice.client'),
      render(row) {
        return [
          h('strong', { class: 'block' }, row.clientName),
          h('span', { class: 'text-body text-xs' }, row.clientEmail),
        ];
      },
    },
    {
      key: 'subtotalAmount',
      title: t('dashboard.invoice.subtotalAmount'),
      render(row) {
        return h(
          'span',
          { class: 'text-body' },
          `${formatPrice(row.subtotalAmount, row.currency)}`
        );
      },
    },
    {
      key: 'totalAmount',
      title: t('dashboard.invoice.totalAmount'),
      render(row) {
        return h('span', { class: 'text-body' }, `${formatPrice(row.totalAmount, row.currency)}`);
      },
    },
    {
      key: 'referenceTable',
      title: t('dashboard.invoice.referenceTable'),
      render(row) {
        return h('span', { class: 'text-body' }, `${row.referenceTable}`);
      },
    },
    {
      key: 'createTime',
      title: t('dashboard.invoice.date'),
      render(row) {
        return h('span', { class: 'text-body' }, dateTimeToDateAndTime(row?.createTime || ''));
      },
    },
  ];
};

const columns = createColumns();

/** On page change, load data */
async function handlePageChange(page: number, limit: number) {
  if (!loading.value) {
    loading.value = true;

    await paymentStore.getInvoices(page, limit);

    loading.value = false;
    pagination.page = page;
    pagination.pageSize = limit;
  }
}
</script>
