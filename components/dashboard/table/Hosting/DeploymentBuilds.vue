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
const deploymentStore = useDeploymentStore();

const pagination = reactive(createPagination(false));

const createColumns = (): NDataTableColumns<DeploymentBuildInterface> => {
  return [
    {
      type: 'expand',
      expandable: () => true,
      renderExpand: rowData => {
        return h('pre', {}, rowData.logs || '');
      },
    },
    {
      title: t('hosting.deploy.build-table.build-status'),
      key: 'buildStatus',
      render(row) {
        return h(resolveComponent('HostingDeploymentBuildStatus'), { buildStatus: row.buildStatus }, '');
      },
    },
    {
      key: 'createTime',
      title: t('dashboard.createTime'),
      render(row: DeploymentBuildInterface) {
        return h('span', {}, { default: () => dateTimeToDateAndTime(row.createTime || '') });
      },
    },
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
