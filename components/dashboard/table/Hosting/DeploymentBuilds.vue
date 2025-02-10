<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="deployments"
    :loading="deploymentStore.buildsLoading"
    :pagination="{
      pageSize: PAGINATION_LIMIT,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
    :row-key="rowKey"
  />
</template>

<script lang="ts" setup>
defineProps({
  deployments: { type: Array<DeploymentBuildInterface>, default: [] },
});

const $i18n = useI18n();
const deploymentStore = useDeploymentStore();
const DeploymentBuildStatus = resolveComponent('HostingDeploymentBuildStatus');

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
      title: $i18n.t('hosting.deploy.build-table.build-status'),
      key: 'buildStatus',
      render(row) {
        return h(DeploymentBuildStatus, { buildStatus: row.buildStatus }, '');
      },
    },
    {
      key: 'createTime',
      title: $i18n.t('dashboard.createTime'),
      render(row: DeploymentBuildInterface) {
        return h('span', {}, { default: () => dateTimeToDateAndTime(row.createTime || '') });
      },
    },
    {
      key: 'finishedTime',
      title: $i18n.t('hosting.deploy.build-table.finished-time'),
      render(row: DeploymentBuildInterface) {
        return h('span', {}, { default: () => dateTimeToDateAndTime(row.finishedTime || '') });
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: DeploymentBuildInterface) => row.id;
</script>
