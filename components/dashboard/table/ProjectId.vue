<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

type RowData = {
  key: number;
  value: string;
  created: string;
};

const createColumns = (): DataTableColumns<RowData> => {
  return [
    {
      title: t('dashboard.value'),
      key: 'value',
    },
    {
      title: t('dashboard.created'),
      key: 'created',
    },
  ];
};
const createData = (): RowData[] => [
  {
    key: 0,
    value: 'project-test-40d53a31-8dac-4d1b-a743-1d88d980fc95',
    created: '20 Jul 2022',
  },
];

const data = createData();
const columns = createColumns();
</script>
