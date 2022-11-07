<template>
  <n-data-table
    table-layout="fixed"
    :bordered="false"
    :columns="columns"
    :data="data"
    :row-props="rowProps"
  />
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
  handleSelectAction,
  handleRoleChange,
}: {
  handleSelectAction: (key: string | number) => void;
  handleRoleChange: (selected: Array<string>) => void;
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
            class: 'select-role',
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
      render() {
        return h(
          NDropdown,
          {
            options: dropdownOptions,
            trigger: 'click',
            onSelect: handleSelectAction,
          },
          {
            default: () =>
              h(
                NButton,
                { size: 'small', quaternary: true },
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

const currentRow = ref<number>(0);
const data = ref(createData());
const columns = createColumns({
  handleSelectAction(key: string | number) {
    console.log(key);
  },
  handleRoleChange(selected: Array<string>) {
    data.value[currentRow.value].role = selected;

    // TODO: sync role change
  },
});

function rowProps(row: RowData) {
  return {
    onClick: () => {
      console.log('rowProps');
      currentRow.value = row.key;
    },
  };
}

/**
 * Dropdown Actions
 */
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
