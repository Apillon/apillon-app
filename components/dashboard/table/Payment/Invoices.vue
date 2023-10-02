<template>
  <n-data-table :bordered="false" :columns="columns" :data="invoices" />
</template>

<script lang="ts" setup>
import { NTag } from 'naive-ui';

defineProps({
  invoices: { type: Array<InvoiceInterface>, default: [] },
});

const { t } = useI18n();

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
      title: t('dashboard.invoice.referenceId'),
      key: 'referenceId',
    },
    {
      title: t('dashboard.invoice.referenceTable'),
      key: 'referenceTable',
    },
    {
      title: t('dashboard.invoice.subtotalAmount'),
      key: 'subtotalAmount',
      render(row) {
        return h('span', {}, `${row.subtotalAmount} ${row.currency}`);
      },
    },
    {
      title: t('dashboard.invoice.totalAmount'),
      key: 'totalAmount',
      render(row) {
        return h('span', {}, `${row.totalAmount} ${row.currency}`);
      },
    },
    {
      title: t('general.status'),
      key: 'active',
      render(row) {
        return h(
          NTag,
          { type: row.status === 5 ? 'success' : 'default', round: true, bordered: false },
          {
            default: () =>
              row.status === 5
                ? h('strong', { class: 'text-black' }, t('general.active'))
                : h('strong', { class: 'text-white' }, t('general.notActive')),
          }
        );
      },
    },
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
</script>
