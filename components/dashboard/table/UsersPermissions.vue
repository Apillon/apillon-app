<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" table-layout="fixed" />
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const SelectRoles = resolveComponent('SelectRoles');

type RowData = {
  key: number;
  name: string;
  email: string;
  role: Array<any>;
};

const createColumns = ({
  selectRow,
  handleSelect,
  handleRoleChange,
}: {
  selectRow: (row: RowData) => void;
  handleSelect: (key: string | number) => void;
  handleRoleChange: (key: string | number) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      title: t('dashboard.user'),
      key: 'name',
    },
    {
      title: t('dashboard.email'),
      key: 'email',
    },
    {
      title: t('dashboard.role'),
      key: 'role',
      className: '!py-0',
      render(row) {
        return h(
          SelectRoles,
          {
            model: row.role,
            options: roleOptions,
            onChange: handleRoleChange,
          },
          ''
        );
      },
    },
    {
      title: t('general.actions'),
      key: 'actions',
      align: 'right',
      className: '!py-0',
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
                { size: 'small', quaternary: true, onClick: selectRow(row) },
                { default: () => h('span', { class: 'icon-more text-lg' }, {}) }
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
    name: 'gosu128',
    email: 'gosu128@gmail.com',
    role: ['owner', 'superadmin'],
  },
  {
    key: 1,
    name: 'gosu12',
    email: 'gosu128@gmail.com',
    role: ['admin'],
  },
  {
    key: 2,
    name: 'gosu1',
    email: 'gosu128@gmail.com',
    role: ['member'],
  },
];

/** Role options */
const roleOptions = [
  {
    label: 'Owner',
    value: 'owner',
  },
  {
    label: 'Superadmin',
    value: 'superadmin',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'Member',
    value: 'member',
  },
];

const currentRow = ref(null);
const data = ref(createData());
const columns = createColumns({
  selectRow(rowData: RowData) {
    currentRow.value = rowData;
    console.log(rowData);
  },
  handleSelect(key: string | number) {
    console.log(key);
  },
  handleRoleChange(key, value) {
    console.log('handleRoleChange');
    console.log(key);
    console.log(data);
    data.value[0].role = key;
  },
});

const dropdownOptions = [
  {
    label: 'Profile',
    key: 'profile',
    props: {
      onClick: () => {
        console.log('Profile: ' + JSON.stringify(currentRow.value));
      },
    },
  },
  {
    label: 'Edit Profile',
    key: 'editProfile',
    props: {
      onClick: () => {
        console.warn('Edit Profile: ' + JSON.stringify(currentRow.value));
      },
    },
  },
  {
    label: 'Logout',
    key: 'logout',
    props: {
      onClick: () => {
        console.log('Logout: ' + JSON.stringify(currentRow.value));
      },
    },
  },
];
</script>
