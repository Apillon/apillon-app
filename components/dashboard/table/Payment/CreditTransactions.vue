<template>
  <n-data-table :bordered="false" :columns="columns" :data="creditTransactions" />
</template>

<script lang="ts" setup>
import { NTag } from 'naive-ui';

defineProps({
  creditTransactions: { type: Array<CreditTransactionInterface>, default: [] },
});

const { t } = useI18n();

const createColumns = (): NDataTableColumns<CreditTransactionInterface> => {
  return [
    {
      title: t('dashboard.credit.name'),
      key: 'name',
      render(row) {
        return h('strong', {}, row.name);
      },
    },
    {
      title: t('dashboard.credit.product_id'),
      key: 'product_id',
    },
    {
      title: t('dashboard.credit.referenceId'),
      key: 'referenceId',
    },
    {
      title: t('dashboard.credit.referenceTable'),
      key: 'referenceTable',
    },
    {
      title: t('dashboard.credit.amount'),
      key: 'amount',
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
