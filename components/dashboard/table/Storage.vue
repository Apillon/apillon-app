<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import { NButton, NDataTable, NDropdown, NTag, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();

type RowData = {
  key: number;
  name: string;
  serviceType: string;
  active: boolean;
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
      key: 'name',
    },
    {
      title: $i18n.t('general.serviceType'),
      key: 'serviceType',
      render(row) {
        return h(
          'span',
          { class: 'text-grey' },
          {
            default: () => [h('span', { class: 'icon-storage text-black' }, ''), row.serviceType],
          }
        );
      },
    },
    {
      title: $i18n.t('general.status'),
      key: 'active',
      render(row) {
        return h(
          NTag,
          { type: row.active ? 'success' : 'default' },
          {
            default: () => (row.active ? $i18n.t('general.active') : $i18n.t('general.paused')),
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
const createData = (): RowData[] => dataStore.services.storage;
const currentRow = ref(null);

const data = createData();
const columns = createColumns({
  selectRow(rowData: RowData) {
    currentRow.value = rowData;
  },
  handleSelect(key: string | number) {
    message.info(
      () =>
        h('span', {}, [
          'Handle',
          h('strong', { class: 'text-white' }, 'Select'),
          JSON.stringify(key),
          JSON.stringify(currentRow.value),
        ]),
      {
        icon: () => h('span', { class: 'icon-info' }, {}),
      }
    );
  },
});

const dropdownOptions = [
  {
    label: 'Profile',
    key: 'profile',
    props: {
      onClick: () => {
        message.success('Profile: ' + JSON.stringify(currentRow.value), {
          icon: () => h('span', { class: 'icon-check' }, {}),
        });
      },
    },
  },
  {
    label: 'Edit Profile',
    key: 'editProfile',
    props: {
      onClick: () => {
        message.warning('Edit Profile: ' + JSON.stringify(currentRow.value), {
          icon: () => h('span', { class: 'icon-info' }, {}),
        });
      },
    },
  },
  {
    label: 'Logout',
    key: 'logout',
    props: {
      onClick: () => {
        message.error('Logout: ' + JSON.stringify(currentRow.value), {
          icon: () => h('span', { class: 'icon-close' }, {}),
        });
      },
    },
  },
];
</script>
