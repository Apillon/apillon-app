<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emit = defineEmits(['changePaymentEmit']);

type RowData = {
  key: number;
  type: string;
  name: string;
  expiration: string;
};

const createColumns = ({
  changePayment,
}: {
  changePayment: (row: RowData) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      title: '',
      key: 'type',
      render(row) {
        return h(
          'img',
          { src: `/images/payment/${row.type}.svg`, width: 50, height: 35, alt: 'mastercard' },
          ''
        );
      },
    },
    {
      title: t('dashboard.card'),
      key: 'name',
      render(row) {
        return h('strong', {}, row.name);
      },
    },
    {
      title: t('dashboard.expiration'),
      key: 'expiration',
    },

    {
      title: '',
      key: 'view',
      align: 'right',
      render(row) {
        return h(
          'strong',
          {
            class: 'text-primary cursor-pointer',
            onClick: () => changePayment(row),
          },
          {
            default: () => t('dashboard.changePayment'),
          }
        );
      },
    },
  ];
};
const createData = (): RowData[] => [
  {
    key: 0,
    type: 'mastercard',
    name: 'Mastercard ending in 9449',
    expiration: '26 Sep 2027',
  },
];

const data = createData();
const columns = createColumns({
  changePayment(rowData: RowData) {
    console.log(rowData);
    emit('changePaymentEmit');
  },
});
</script>
