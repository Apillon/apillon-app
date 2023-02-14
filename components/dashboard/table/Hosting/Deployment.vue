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
defineProps({
  deployments: { type: Array<DeploymentInterface>, default: [] },
});

const $i18n = useI18n();
const dataStore = useDataStore();
const DeploymentStatus = resolveComponent('DeploymentStatus');

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
      title: $i18n.t('general.updateTime'),
      key: 'updateTime',
      render(row: DeploymentInterface) {
        return h('span', {}, { default: () => datetimeToDateAndTime(row.updateTime || '') });
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: DeploymentInterface) => row.id;
</script>
