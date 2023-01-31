<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="deployments"
    :loading="dataStore.webpage.deployment.loading"
    :pagination="{ pageSize: PAGINATION_LIMIT }"
    :row-key="rowKey"
  />
</template>

<script lang="ts" setup>
import { NTag } from 'naive-ui';

const props = defineProps({
  deployments: { type: Array<DeploymentInterface>, default: [] },
});

const $i18n = useI18n();
const dataStore = useDataStore();

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
            default: () =>
              row.environment === DeploymentEnvironment.PRODUCTION
                ? $i18n.t('general.production')
                : $i18n.t('general.staging'),
          }
        );
      },
    },
    {
      title: $i18n.t('hosting.deploymentStatus'),
      key: 'deploymentStatus',
      render(row) {
        return h(
          NTag,
          { type: getDeploymentStatus(row.deploymentStatus), round: true, bordered: false },
          {
            default: () => $i18n.t(`hosting.deployment.status.${row.deploymentStatus}`),
          }
        );
      },
    },
    {
      key: 'size',
      title: $i18n.t('storage.fileSize'),
      render(row: DeploymentInterface) {
        if (row.size) {
          return h('span', {}, { default: () => formatBytes(row.size || 0) });
        }
        return '';
      },
    },
    {
      title: $i18n.t('dashboard.updateTime'),
      key: 'updateTime',
      render(row: DeploymentInterface) {
        return h('span', {}, { default: () => datetimeToDate(row.updateTime || '') });
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: DeploymentInterface) => row.id;

/** Deployment status */
function getDeploymentStatus(status: number) {
  switch (status) {
    case DeploymentStatus.IN_PROGRESS:
      return 'info';
    case DeploymentStatus.SUCCESSFUL:
      return 'success';
    case DeploymentStatus.FAILED:
      return 'error';
    default:
      return '';
  }
}
</script>
