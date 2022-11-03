<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import { NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

type RowData = {
  key: number;
  date: string;
  name: string;
  total: string;
  active: boolean;
};

const createColumns = ({
  viewInvoice,
}: {
  viewInvoice: (row: RowData) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      title: t('dashboard.date'),
      key: 'date',
    },
    {
      title: t('dashboard.invoice'),
      key: 'invoice',
      render(row) {
        return h('strong', {}, row.name);
      },
    },
    {
      title: t('dashboard.total'),
      key: 'total',
    },
    {
      title: t('general.status'),
      key: 'active',
      render(row) {
        return h(
          NTag,
          { type: row.active ? 'success' : 'default', round: true, bordered: false },
          {
            default: () =>
              row.active ? h('strong', {}, t('general.active')) : t('general.notActive'),
          }
        );
      },
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
            onClick: () => viewInvoice(row),
          },
          {
            default: () => t('dashboard.viewInvoice'),
          }
        );
      },
    },
  ];
};
const createData = (): RowData[] => [
  {
    key: 0,
    date: '20 Jul 2022',
    name: 'invoice009.pdf',
    total: '$30.00',
    active: true,
  },
  {
    key: 0,
    date: '20 Jul 2022',
    name: 'invoice008.pdf',
    total: '$20.00',
    active: false,
  },
];

const data = createData();
const columns = createColumns({
  viewInvoice(rowData: RowData) {
    console.log(rowData);
  },
});
</script>
