<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" :row-props="rowProps" />
</template>

<script lang="ts" setup>
import { DataTableColumns, NButton, NDropdown, NTag, useMessage } from 'naive-ui';

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const IconStatus = resolveComponent('IconStatus');

const createColumns = (): DataTableColumns<ServiceInterface> => {
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
        // TODO: Uptime
        return h('span', {}, { default: () => timeToDays('') });
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
const createData = (): ServiceInterface[] => dataStore.services.authentication;
const currentRow = ref<ServiceInterface>({} as ServiceInterface);

const data = createData();
const columns = createColumns();

function rowProps(row: ServiceInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
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
