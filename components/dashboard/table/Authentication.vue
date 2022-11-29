<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" :row-props="rowProps" />
</template>

<script lang="ts" setup>
import { DataTableColumns, NButton, NDropdown, NTag, useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { timeToDays } from '~~/lib/utils';
import { useDataStore } from '~~/stores/data';

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const IconStatus = resolveComponent('IconStatus');

type RowData = {
  key: number;
  name: string;
  serviceType: string;
  active: boolean;
  uptime: string;
};

const createColumns = ({
  handleSelect,
}: {
  handleSelect: (key: string | number) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      title: t('general.serviceName'),
      key: 'name',
      render(row) {
        return [
          h(IconStatus, { active: row.active }, ''),
          h('span', { class: 'ml-2 text-blue' }, row.serviceType),
        ];
      },
    },
    {
      title: t('general.serviceType'),
      key: 'serviceType',
      render(row) {
        return h(
          'span',
          { class: 'text-grey' },
          {
            default: () => row.serviceType,
          }
        );
      },
    },
    {
      title: t('general.status'),
      key: 'active',
      render(row) {
        return h(
          NTag,
          { type: row.active ? 'success' : 'default', round: true, bordered: false },
          {
            default: () => (row.active ? t('general.active') : t('general.paused')),
          }
        );
      },
    },
    {
      title: t('general.uptime'),
      key: 'uptime',
      render(row) {
        return h('span', {}, { default: () => timeToDays(row.uptime) });
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
            onSelect: handleSelect,
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
const createData = (): RowData[] => dataStore.services.authentication;
const currentRow = ref<number>(0);

const data = createData();
const columns = createColumns({
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

function rowProps(row: RowData) {
  return {
    onClick: () => {
      console.log('rowProps');
      currentRow.value = row.key;
    },
  };
}

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
