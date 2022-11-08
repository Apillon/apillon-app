<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" :row-props="rowProps" />
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

type RowData = {
  key: number;
  secret: string;
  name: string;
  env: string;
  created: string;
};

const createColumns = ({
  handleSelectAction,
}: {
  handleSelectAction: (key: string | number) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      title: t('dashboard.secret'),
      key: 'secret',
    },
    {
      title: t('dashboard.name'),
      key: 'name',
    },
    {
      title: t('dashboard.env'),
      key: 'env',
    },
    {
      title: t('dashboard.created'),
      key: 'created',
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
    secret: '•••••••••••••••••••••••••••••••••••••••••••••••Q0I=',
    name: 'Test key',
    env: 'Live',
    created: '20 Jul 2022',
  },
  {
    key: 0,
    secret: '•••••••••••••••••••••••••••••••••••••••••••••••R02I',
    name: 'October key',
    env: 'Test',
    created: '21 Jul 2022',
  },
];

const currentRow = ref<number>(0);
const data = ref(createData());
const columns = createColumns({
  handleSelectAction(key: string | number) {
    console.log(key);
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
