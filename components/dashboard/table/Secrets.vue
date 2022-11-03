<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { NButton, NInput, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const message = useMessage();

type RowData = {
  key: number;
  secret: string;
  name: string;
  created: string | Date;
};

const createColumns = ({
  viewRow,
  deleteRow,
}: {
  viewRow: (rowData: RowData) => void;
  deleteRow: (rowData: RowData) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      title: $i18n.t('general.secret'),
      key: 'secret',
      render(row) {
        return h(
          NInput,
          {
            type: 'password',
            value: row.secret,
            readonly: true,
          },
          {}
        );
      },
    },
    {
      title: $i18n.t('general.name'),
      key: 'name',
    },
    {
      title: $i18n.t('general.created'),
      key: 'created',
    },
    {
      key: 'view',
      render(row) {
        return h(
          NButton,
          {
            type: 'default',
            onClick: () => viewRow(row),
          },
          {
            default: () => h('span', { class: 'icon-view' }, ''),
          }
        );
      },
    },
    {
      key: 'delete',
      render(row) {
        return h(
          NButton,
          {
            type: 'default',
            onClick: () => deleteRow(row),
          },
          {
            default: () => h('span', { class: 'icon-delete' }, ''),
          }
        );
      },
    },
  ];
};
const createData = (): RowData[] => [
  {
    key: 0,
    secret: 'ucisdbcnxsi',
    name: 'test key',
    created: '02 jul 2022',
  },
];

const data = createData();
const columns = createColumns({
  viewRow(rowData) {
    message.info('view ' + JSON.stringify(rowData));
  },
  deleteRow(rowData) {
    message.info('delete ' + JSON.stringify(rowData));
  },
});
</script>
