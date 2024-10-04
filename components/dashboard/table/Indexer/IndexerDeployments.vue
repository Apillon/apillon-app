<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="indexerDeploymentsStore.items"
    :loading="indexerDeploymentsStore.loading"
    :row-key="rowKey"
    remote
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const indexerDeploymentsStore = useIndexerDeploymentsStore();

const rowKey = (row: IndexerDeploymentInferface) => row.id;

const columns = computed(() => [
  {
    key: 'level',
    title: t('dashboard.service.indexer.tableDeployments.type'),
    render(row) {
      return h('strong', {}, { default: () => row.type });
    },
  },
  {
    key: 'failed',
    title: t('dashboard.service.indexer.tableDeployments.failed'),
    render(row) {
      return h('strong', {}, { default: () => row.failed });
    },
  },
  {
    key: 'status',
    title: t('dashboard.service.indexer.tableDeployments.status'),
    render(row) {
      return h('strong', {}, { default: () => row.status });
    },
  },
  {
    key: 'createdAt',
    title: t('dashboard.service.indexer.tableDeployments.createdAt'),
    render(row: IndexerDeploymentInferface) {
      return h('span', {}, { default: () => dateTimeToDateAndTime(row.createdAt || '') });
    },
  },
  {
    key: 'updatedAt',
    title: t('dashboard.service.indexer.tableDeployments.updatedAt'),
    render(row: IndexerDeploymentInferface) {
      return h('span', {}, { default: () => dateTimeToDateAndTime(row.updatedAt || '') });
    },
  },
]);
</script>
