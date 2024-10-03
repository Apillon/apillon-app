<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="indexerLogStore.items"
    :loading="indexerLogStore.loading"
    :pagination="indexerLogStore.pagination"
    :row-key="rowKey"
    remote
    @update:page="(page: number) => handlePageChange(page, indexerLogStore.pagination.pageSize)"
    @update:page-size="(pageSize: number) => handlePageChange(1, pageSize)"
  />
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';

const { t } = useI18n();
const indexerLogStore = useIndexerLogStore();

const rowKey = (row: IndexerLogInterface) => row.id;

const columns = computed(() => [
  {
    key: 'level',
    title: t('dashboard.service.indexer.tableLog.level'),
    render(row) {
      return h('strong', {}, { default: () => row.level });
    },
  },
  {
    key: 'container',
    title: t('dashboard.service.indexer.tableLog.container'),
    render(row) {
      return h('strong', {}, { default: () => row.container });
    },
  },
  {
    key: 'timestamp',
    title: t('dashboard.service.indexer.tableLog.ts'),
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
const debouncedSearchFilter = useDebounceFn(handlePageChange, 500);

async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {
  await indexerLogStore.fetchLogs(page, limit);
  indexerLogStore.pagination.page = page;
  indexerLogStore.pagination.pageSize = limit;
}
</script>
