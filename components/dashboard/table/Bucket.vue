<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" :row-props="rowProps" />
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NTag, NProgress, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useDataStore } from '~~/stores/data';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();

type RowData = {
  key: number;
  name: string;
  usage: string;
  traffic: boolean;
  visits: string;
};

const createColumns = ({
  handleSelect,
}: {
  handleSelect: (key: string | number) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      title: $i18n.t('storage.bucketName'),
      key: 'name',
      render(row) {
        return h('span', { class: 'ml-2 text-blue' }, row.name);
      },
    },
    {
      title: $i18n.t('storage.usage'),
      key: 'serviceType',
      render(row) {
        return h(
          'span',
          { class: 'text-grey' },
          {
            default: () => row.usage,
          }
        );
      },
    },
    {
      title: $i18n.t('storage.traffic'),
      key: 'traffic',
    },
    {
      title: $i18n.t('general.visits'),
      key: 'visits',
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
const createData = (): RowData[] => dataStore.services.storage;
const currentRow = ref(null);

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
