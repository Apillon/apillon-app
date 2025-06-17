<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="deployments"
    :loading="deploymentStore.buildsLoading"
    :pagination="pagination"
    :default-expanded-row-keys="defaultExpandedRowKey"
    :row-key="rowKey"
    @update:page-size="(pz: number) => (pagination.pageSize = pz)"
  />
</template>

<script lang="ts" setup>
defineProps({
  deployments: { type: Array<DeploymentBuildInterface>, default: [] },
});

const { t } = useI18n();
const { tableRowCreateTime } = useTable();
const deploymentStore = useDeploymentStore();

const pagination = reactive(createPagination(false));

const createColumns = (): NDataTableColumns<DeploymentBuildInterface> => {
  return [
    {
      type: 'expand',
      expandable: () => true,
      renderExpand: rowData => {
        return h(
          'pre',
          {
            style: {
              margin: '-12px',
              padding: '12px',
              maxHeight: '400px', // Limit the height
              overflowY: 'auto', // Add vertical scrollbar
              whiteSpace: 'pre-wrap', // Preserve whitespace and wrap text
            },
          },
          rowData.logs || ''
        );
      },
    },
    {
      title: t('hosting.deploy.build-table.build-status'),
      key: 'buildStatus',
      render(row) {
        return h(resolveComponent('HostingDeploymentBuildStatus'), { status: row.buildStatus }, '');
      },
    },
    tableRowCreateTime,
    {
      key: 'finishedTime',
      title: t('hosting.deploy.build-table.finished-time'),
      render(row: DeploymentBuildInterface) {
        return h('span', {}, { default: () => dateTimeToDateAndTime(row.finishedTime || '') });
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: DeploymentBuildInterface) => row.id;
const defaultExpandedRowKey = computed(() => {
  return deploymentStore.builds.length ? [rowKey(deploymentStore.builds[0])] : [];
});
</script>
