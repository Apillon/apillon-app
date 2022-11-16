<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" :row-props="rowProps" />
</template>

<script lang="ts" setup>
import { NButton, NDropdown, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useDataStore } from '~~/stores/data';
import { BucketInterface } from '~~/types/service';

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const router = useRouter();
const ProgressStorage = resolveComponent('ProgressStorage');

interface RowData extends BucketInterface {
  key: number;
}

const createColumns = ({
  handleSelect,
}: {
  handleSelect: (key: string | number) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      title: t('storage.bucketName'),
      key: 'name',
      render(row) {
        return h('span', { class: 'ml-2 text-blue' }, row.name);
      },
    },
    {
      title: t('storage.usage'),
      key: 'serviceType',
      render(row) {
        return h(
          ProgressStorage,
          {
            size: row.sizeMb,
            maxSize: row.maxSizeMb,
            percentage: row.percentage,
          },
          null
        );
      },
    },
    {
      title: t('storage.traffic'),
      key: 'traffic',
    },
    {
      title: t('storage.visits'),
      key: 'visits',
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
const createData = (): RowData[] => dataStore.services.bucket;
const currentRow = ref<RowData | null>(null);

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
      currentRow.value = row;
    },
  };
}

const dropdownOptions = [
  {
    label: t('storage.edit'),
    key: 'storageEdit',
    props: {
      onClick: () => {
        router.push(`/dashboard/service/storage/bucket/${currentRow.value.id}`);
      },
    },
  },
  {
    label: t('storage.delete'),
    key: 'storage.delete',
    props: {
      onClick: () => {
        message.error('TODO: DELETE' + JSON.stringify(currentRow.value), {
          icon: () => h('span', { class: 'icon-close' }, {}),
        });
      },
    },
  },
];
</script>
