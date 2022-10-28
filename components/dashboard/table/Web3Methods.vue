<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import { DataTableColumns, NSwitch, NTag } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();

type RowData = {
  key: number;
  method: string;
  status: boolean;
};

const createColumns = ({
  changeStatus,
}: {
  changeStatus: (rowData: RowData) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      title: $i18n.t('general.method'),
      key: 'method',
    },
    {
      title: $i18n.t('general.status'),
      key: 'status',
      render(row) {
        return h(
          NTag,
          { type: row.status ? 'success' : 'default' },
          {
            default: () => (row.status ? $i18n.t('general.active') : $i18n.t('general.paused')),
          }
        );
      },
    },
    {
      title: $i18n.t('general.action'),
      key: 'action',
      render(row) {
        return h(NSwitch, {
          onClick: () => changeStatus(row),
        });
      },
    },
  ];
};
const createData = (): RowData[] => [
  {
    key: 0,
    method: 'Email',
    status: true,
  },
  {
    key: 1,
    method: 'Twitter',
    status: false,
  },
  {
    key: 2,
    method: 'Anonymus',
    status: true,
  },
  {
    key: 2,
    method: 'MetaMask wallet',
    status: true,
  },
];

const data = createData();
const columns = createColumns({
  changeStatus(rowData) {},
});
</script>
