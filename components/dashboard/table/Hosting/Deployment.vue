<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="deployments"
    :loading="deploymentStore.loading"
    :pagination="{ pageSize: PAGINATION_LIMIT }"
    :row-key="rowKey"
  />
</template>

<script lang="ts" setup>
defineProps({
  deployments: { type: Array<DeploymentInterface>, default: [] },
});

const $i18n = useI18n();
const deploymentStore = useDeploymentStore();
const DeploymentStatus = resolveComponent('HostingDeploymentStatus');

const createColumns = (): NDataTableColumns<DeploymentInterface> => {
  return [
    {
      key: 'environment',
      title: $i18n.t('general.environment'),
      minWidth: 150,
      render(row) {
        return h(
          'span',
          {},
          {
            default: () => $i18n.t(`hosting.deployment.env.${row.environment}`),
          }
        );
      },
    },
    {
      title: $i18n.t('hosting.deploymentStatus'),
      key: 'deploymentStatus',
      render(row) {
        return h(DeploymentStatus, { deploymentStatus: row.deploymentStatus }, '');
      },
    },
    {
      key: 'size',
      title: $i18n.t('hosting.size'),
      render(row: DeploymentInterface) {
        if (row.size) {
          return h('span', {}, { default: () => formatBytes(row.size || 0) });
        }
        return '';
      },
    },
    {
      key: 'createTime',
      title: $i18n.t('dashboard.createTime'),
      render(row: DeploymentInterface) {
        return h('span', {}, { default: () => dateTimeToDateAndTime(row.createTime || '') });
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: DeploymentInterface) => row.deployment_uuid;
</script>
