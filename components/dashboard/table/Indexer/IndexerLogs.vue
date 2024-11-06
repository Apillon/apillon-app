<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="indexerLogStore.items"
    :loading="indexerLogStore.loading"
    :row-key="rowKey"
    remote
  />
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';

const { t } = useI18n();
const indexerStore = useIndexerStore();
const indexerLogStore = useIndexerLogStore();

const rowKey = (row: IndexerLogInterface) => row.id;

const columns = computed(() => [
  {
    key: 'level',
    title: t('dashboard.service.indexer.tableLog.level'),
    render(row: IndexerLogInterface) {
      return h(resolveComponent('IndexerLogLevel'), { logLevel: row.level }, '');
    },
  },
  {
    key: 'container',
    title: t('dashboard.service.indexer.tableLog.container'),
    minWidth: 150,
    render(row: IndexerLogInterface) {
      return h('strong', {}, { default: () => row.container });
    },
  },
  {
    key: 'timestamp',
    title: t('dashboard.service.indexer.tableLog.ts'),
    minWidth: 200,
    render(row: IndexerLogInterface) {
      return h('span', {}, { default: () => dateTimeToDateAndTime(row.timestamp || '') });
    },
  },
  {
    key: 'payload',
    title: t('dashboard.service.indexer.tableLog.msg'),
    render(row) {
      return h('strong', {}, { default: () => row.payload.msg });
    },
  },
]);

/** Search posts */
watch(
  () => indexerLogStore.search,
  _ => {
    indexerLogStore.loading = true;
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = useDebounceFn(fetchLogs, 500);

async function fetchLogs() {
  if (indexerStore.active) {
    await indexerLogStore.fetchLogs(indexerStore.active.indexer_uuid);
  }
}
</script>
