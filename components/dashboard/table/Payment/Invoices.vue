<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="paymentStore.invoices.items"
    :loading="paymentStore.invoices.loading"
    :pagination="paymentStore.invoices.pagination"
    @update:page="(page: number) => handlePageChange(page, paymentStore.invoices.pagination.pageSize)"
    @update:page-size="(pageSize: number) => handlePageChange(1, pageSize)"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const paymentStore = usePaymentStore();

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
        return h('span', { class: 'text-body' }, `${formatPrice(row.subtotalAmount, row.currency)}`);
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
  if (!paymentStore.invoices.loading) {
    paymentStore.invoices.loading = true;

    await paymentStore.getInvoices(page, limit);

    paymentStore.invoices.loading = false;
    paymentStore.invoices.pagination.page = page;
    paymentStore.invoices.pagination.pageSize = limit;
  }
}
</script>
