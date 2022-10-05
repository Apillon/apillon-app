<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import { NButton, NDataTable, NDropdown, NTag, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const message = useMessage();

type RowData = {
  key: number;
  serviceName: string;
  serviceType: string;
  status: boolean;
  uptime: string;
};

const createColumns = ({
  selectRow,
  handleSelect,
}: {
  selectRow: (row: RowData) => void;
  handleSelect: (key: string | number) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      title: $i18n.t('general.serviceName'),
      key: 'serviceName',
    },
    {
      title: $i18n.t('general.serviceType'),
      key: 'serviceType',
      render(row) {
        return h(
          'span',
          { class: 'text-grey' },
          {
            default: () => [
              h('span', { class: 'icon-authentication text-black' }, ''),
              row.serviceType,
            ],
          }
        );
      },
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
      title: $i18n.t('general.uptime'),
      key: 'uptime',
    },
    {
      title: $i18n.t('general.actions'),
      key: 'actions',
      render(row) {
        return h(
          NDropdown,
          {
            options: dropdownOptions,
            trigger: 'click',
            onSelect: handleSelect,
          },
          {
            default: () =>
              h(
                NButton,
                { onClick: selectRow(row) },
                { default: () => h('span', { class: 'icon-more' }, {}) }
              ),
          }
        );
      },
    },
  ];
};
const createData = (): RowData[] => [
  {
    key: 0,
    serviceName: 'App Mobile',
    serviceType: 'auth',
    status: true,
    uptime: '32d',
  },
  {
    key: 1,
    serviceName: 'App ',
    serviceType: 'authentication',
    status: true,
    uptime: '24d',
  },
];
const currentRow = ref(null);

const data = createData();
const columns = createColumns({
  selectRow(rowData: RowData) {
    currentRow.value = rowData;
  },
  handleSelect(key: string | number) {
    message.info('Handle select ' + JSON.stringify(key) + JSON.stringify(currentRow.value));
  },
});

const dropdownOptions = [
  {
    label: 'Profile',
    key: 'profile',
    props: {
      onClick: () => {
        message.success('Profile: ' + JSON.stringify(currentRow.value));
      },
    },
  },
  {
    label: 'Edit Profile',
    key: 'editProfile',
    props: {
      onClick: () => {
        message.success('Edit Profile: ' + JSON.stringify(currentRow.value));
      },
    },
  },
  {
    label: 'Logout',
    key: 'logout',
    props: {
      onClick: () => {
        message.success('Logout: ' + JSON.stringify(currentRow.value));
      },
    },
  },
];
</script>
