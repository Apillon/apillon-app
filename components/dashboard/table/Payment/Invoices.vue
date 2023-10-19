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
      title: t('dashboard.invoice.clientName'),
      key: 'invoice',
      render(row) {
        return h('strong', {}, row.clientName);
      },
    },
    {
      title: t('dashboard.invoice.clientEmail'),
      key: 'clientEmail',
    },
    {
      title: t('dashboard.invoice.subtotalAmount'),
      key: 'subtotalAmount',
      render(row) {
        return h('span', {}, `${row.subtotalAmount} ${formatCurrency(row.currency)}`);
      },
    },
    {
      title: t('dashboard.invoice.totalAmount'),
      key: 'totalAmount',
      render(row) {
        return h('span', {}, `${row.totalAmount} ${formatCurrency(row.currency)}`);
      },
    },
    {
      title: t('dashboard.invoice.referenceTable'),
      key: 'referenceTable',
      render(row) {
        return h('span', {}, `${row.referenceTable}`);
      },
    },
    {
      title: t('dashboard.invoice.date'),
      key: 'createTime',
      render(row) {
        return dateTimeToDateAndTime(row?.createTime || '');
      },
    },
    // {
    //   title: t('general.status'),
    //   key: 'active',
    //   render(row) {
    //     return h(
    //       NTag,
    //       { type: row.status === 5 ? 'success' : 'default', round: true, bordered: false },
    //       {
    //         default: () =>
    //           row.status === 5
    //             ? h('strong', { class: 'text-black' }, t('general.active'))
    //             : h('strong', { class: 'text-white' }, t('general.notActive')),
    //       }
    //     );
    //   },
    // },
    // {
    //   title: '',
    //   key: 'view',
    //   align: 'right',
    //   render(row) {
    //     return h(
    //       'strong',
    //       {
    //         class: 'text-primary cursor-pointer',
    //         onClick: () => viewInvoice(row),
    //       },
    //       {
    //         default: () => t('dashboard.viewInvoice'),
    //       }
    //     );
    //   },
    // },
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
