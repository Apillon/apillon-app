<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

type RowData = {
  key: number;
  user: string;
  email: string;
  role: string;
};

const createColumns = (): DataTableColumns<RowData> => {
  return [
    {
      title: t('dashboard.user'),
      key: 'user',
    },
    {
      title: t('dashboard.email'),
      key: 'email',
    },
    {
      title: t('dashboard.role'),
      key: 'role',
    },
  ];
};
const createData = (): RowData[] => [
  {
    key: 0,
    user: 'gosu128',
    email: 'gosu128@gmail.com',
    role: 'owner, superadmin',
  },
];

const data = createData();
const columns = createColumns();
</script>
