<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="dataStore.services.bucket"
    :row-props="rowProps"
  />
</template>

<script lang="ts" setup>
import { NButton, NDropdown, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const router = useRouter();
const ProgressStorage = resolveComponent('ProgressStorage');

interface RowData extends BucketInterface {
  key: number;
}

const createColumns = (): DataTableColumns<RowData> => {
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
      title: $i18n.t('storage.traffic'),
      key: 'traffic',
    },
    {
      title: $i18n.t('storage.visits'),
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
const currentRow = ref<RowData | null>(null);

const rowProps = (row: RowData) => {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
};

const dropdownOptions = [
  {
    label: $i18n.t('storage.edit'),
    key: 'storageEdit',
    props: {
      onClick: () => {
        router.push(`/dashboard/service/storage/bucket/${currentRow.value?.id}`);
      },
    },
  },
  {
    label: $i18n.t('storage.delete'),
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

/**
 * Load data on mounted
 */
onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(_ => {
      getBuckets();
    });
  }, 100);
});

async function getBuckets() {
  if (!dataStore.hasServices(ServiceType.BUCKET)) {
    await dataStore.getBuckets($i18n);
  }
}
</script>
