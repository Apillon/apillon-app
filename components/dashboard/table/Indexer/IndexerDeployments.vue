<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="indexerDeploymentsStore.items"
    :expanded-row-keys="expandedRows"
    :loading="indexerDeploymentsStore.loading"
    :row-key="rowKey"
    :row-props="rowProps"
    remote
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const indexerDeploymentsStore = useIndexerDeploymentsStore();
const expandedRows = ref<Array<string | number>>([]);

const rowKey = (row: IndexerDeploymentInterface) => row.id;
const currentRow = ref<IndexerDeploymentInterface | null>(null);

/** On row click */
const rowProps = (row: IndexerDeploymentInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        selectDeployment();
      }
    },
  };
};

const columns = computed(() => [
  {
    type: 'expand',
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    renderExpand(row: IndexerDeploymentInterface) {
      if (row.id) {
        return h(resolveComponent('IndexerDeploymentDetails'), {}, '');
      }
      return null;
    },
  },
  {
    key: 'level',
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    title: t('indexer.tableDeployments.type'),
    render(row) {
      return h('strong', {}, { default: () => row.type });
    },
  },
  {
    key: 'createdAt',
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    title: t('indexer.tableDeployments.createdAt'),
    render(row: IndexerDeploymentInterface) {
      return h('span', {}, { default: () => dateTimeToDateAndTime(row.createdAt || '') });
    },
  },
  {
    key: 'updatedAt',
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    title: t('indexer.tableDeployments.updatedAt'),
    render(row: IndexerDeploymentInterface) {
      return h('span', {}, { default: () => dateTimeToDateAndTime(row.updatedAt || '') });
    },
  },
  {
    key: 'status',
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    title: t('general.status'),
    render(row: IndexerDeploymentInterface) {
      return h(resolveComponent('IndexerStatusDeployment'), { deploy: row }, '');
    },
  },
]);

function selectDeployment() {
  if (currentRow.value) {
    const deploymentId = currentRow.value.id;
    indexerDeploymentsStore.active = currentRow.value;
    expandedRows.value = expandedRows.value.includes(deploymentId) ? [] : [deploymentId];
  }
}
</script>
