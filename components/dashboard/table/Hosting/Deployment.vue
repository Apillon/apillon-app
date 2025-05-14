<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="deployments"
    :loading="deploymentStore.loading"
    :pagination="pagination"
    :row-key="rowKey"
    @update:page-size="(pz: number) => (pagination.pageSize = pz)"
  />
</template>

<script lang="ts" setup>
defineProps({
  deployments: { type: Array<DeploymentInterface>, default: [] },
});

const { t } = useI18n();
const deploymentStore = useDeploymentStore();

const pagination = reactive(createPagination(false));

const createColumns = (): NDataTableColumns<DeploymentInterface> => {
  return [
    {
      key: 'environment',
      title: t('general.environment'),
      minWidth: 150,
      render(row) {
        return h(
          'span',
          {},
          {
            default: () => t(`hosting.deployment.env.${row.environment}`),
          }
        );
      },
    },
    {
      title: t('hosting.deploymentStatus'),
      key: 'deploymentStatus',
      render(row) {
        return h(resolveComponent('HostingDeploymentStatus'), { deploymentStatus: row.deploymentStatus }, '');
      },
    },
    {
      key: 'size',
      title: t('hosting.size'),
      render(row: DeploymentInterface) {
        if (row.size) {
          return h('span', {}, { default: () => formatBytes(row.size || 0) });
        }
        return '';
      },
    },
    {
      key: 'createTime',
      title: t('dashboard.createTime'),
      render(row: DeploymentInterface) {
        return h('span', {}, { default: () => dateTimeToDateAndTime(row.createTime || '') });
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: DeploymentInterface) => row.deployment_uuid;
</script>
