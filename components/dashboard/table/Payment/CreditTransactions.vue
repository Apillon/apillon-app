<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="paymentsStore.creditTransactions.items"
    :loading="loading"
    :pagination="pagination"
    @update:page="handlePageChange"
  />
</template>

<script lang="ts" setup>
import { NTag } from 'naive-ui';

const { t } = useI18n();
const paymentsStore = usePaymentsStore();

const loading = ref<boolean>(false);

/** Pagination data */
const currentPage = ref<number>(1);
const pagination = computed(() => {
  return {
    page: currentPage.value,
    pageSize: PAGINATION_LIMIT,
    pageSizes: [PAGINATION_LIMIT, 50, 100],
    pageCount: Math.ceil(paymentsStore.invoices.total / PAGINATION_LIMIT),
    itemCount: paymentsStore.invoices.total,
  };
});

const createColumns = (): NDataTableColumns<CreditTransactionInterface> => {
  return [
    {
      title: t('dashboard.credits.name'),
      key: 'name',
      render(row) {
        return h('strong', {}, row.name);
      },
    },

    {
      title: t('dashboard.credits.category'),
      key: 'category',
    },
    {
      title: t('dashboard.credits.service'),
      key: 'service',
    },
    {
      title: t('dashboard.credits.description'),
      key: 'description',
    },
    {
      title: t('dashboard.credits.amount'),
      key: 'amount',
    },
    {
      title: t('dashboard.credits.createTime'),
      key: 'createTime',
      render(row) {
        return datetimeToDateAndTime(row?.createTime || '');
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
    await paymentsStore.fetchCreditTransactions(page, PAGINATION_LIMIT);
    currentPage.value = page;
  }
}
</script>
