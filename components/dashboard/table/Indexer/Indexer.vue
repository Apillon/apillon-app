<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="indexerStore.items"
    :loading="indexerStore.loading"
    :pagination="indexerStore.pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    remote
    @update:page="(page: number) => handlePageChange(page, indexerStore.pagination.pageSize)"
    @update:page-size="(pageSize: number) => handlePageChange(1, pageSize)"
  />
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';

const { t } = useI18n();
const router = useRouter();
const indexerStore = useIndexerStore();

const rowKey = (row: IndexerBaseInterface) => row.indexer_uuid;
const currentRow = ref<IndexerBaseInterface>(indexerStore.items[0]);

const columns = computed(() => [
  {
    key: 'name',
    title: t('dashboard.service.indexer.table.name'),
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    render(row) {
      return h('strong', {}, { default: () => row.name });
    },
  },
  {
    key: 'description',
    title: t('dashboard.service.indexer.table.description'),
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    render(row) {
      return h('strong', {}, { default: () => row.description });
    },
  } /*,
  {
    key: 'status',
    title: t('dashboard.service.smartContracts.table.status'),
    render(row) {
      return h(
        resolveComponent('SmartContractsStatusLabel'),
        { contractStatus: row.contractStatus },
        ''
      );
    },
  }, */,
  {
    key: 'createTime',
    title: t('dashboard.createTime'),
    render(row: DeploymentInterface) {
      return h('span', {}, { default: () => dateTimeToDateAndTime(row.createTime || '') });
    },
  },
]);
/** On row click */
const rowProps = (row: IndexerBaseInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;
      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/indexer/${row.indexer_uuid}` });
      }
    },
  };
};

/** Search posts */
watch(
  () => indexerStore.search,
  _ => {
    indexerStore.loading = true;
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = useDebounceFn(handlePageChange, 500);

async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {
  await indexerStore.fetchIndexers(page, limit);
  indexerStore.pagination.page = page;
  indexerStore.pagination.pageSize = limit;
}
</script>
