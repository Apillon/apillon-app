<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="dataStore.services.storage"
    :row-props="rowProps"
  />
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NTag, useMessage } from 'naive-ui';

const $i18n = useI18n();
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

const createColumns = (): NDataTableColumns<RowData> => {
  return [
    {
      title: $i18n.t('general.serviceName'),
      key: 'name',
      render(row) {
        return [
          h(IconStatus, { active: row.active }, ''),
          h('span', { class: 'ml-2 text-blue' }, row.serviceType),
        ];
      },
    },
    {
      title: $i18n.t('general.serviceType'),
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
      title: $i18n.t('general.status'),
      key: 'active',
      render(row) {
        return h(
          NTag,
          { type: row.active ? 'success' : 'default', round: true, bordered: false },
          {
            default: () => (row.active ? $i18n.t('general.active') : $i18n.t('general.paused')),
          }
        );
      },
    },
    {
      title: $i18n.t('general.uptime'),
      key: 'uptime',
      render(row) {
        return h('span', {}, { default: () => timeToDays(row.uptime) });
      },
    },
    {
      title: $i18n.t('general.actions'),
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
const columns = createColumns();
const currentRow = ref<number>(0);

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

function rowProps(row: RowData) {
  return {
    onClick: () => {
      currentRow.value = row.key;
    },
  };
}

/**
 * Load data on mounted
 */
onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(_ => {
      getServicesStorage();
    });
  }, 100);
});

async function getServicesStorage() {
  if (!dataStore.hasServices(ServiceType.STORAGE)) {
    await dataStore.getStorageServices();
  }
}
</script>
