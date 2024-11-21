<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="indexerBillingStore.items"
    :expanded-row-keys="expandedRows"
    :loading="indexerBillingStore.loading"
    :row-key="rowKey"
    remote
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const indexerBillingStore = useIndexerBillingStore();
const expandedRows = ref<Array<string | number>>([]);

const rowKey = (row: IndexerBillingInterface) => row.id;

const columns = computed(() => [
  {
    key: 'year',
    title: t('indexer.tableBilling.year'),
    render(row) {
      return h('strong', {}, { default: () => row.year });
    },
  },
  {
    key: 'month',
    title: t('indexer.tableBilling.month'),
    render(row) {
      return h('strong', {}, { default: () => row.month });
    },
  },
  {
    key: 'billedAmount',
    title: t('indexer.tableBilling.billedAmount'),
    render(row) {
      return h('strong', {}, { default: () => row.billedAmount + ' $' });
    },
  },
]);
</script>
