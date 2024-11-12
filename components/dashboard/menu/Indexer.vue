<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const indexerStore = useIndexerStore();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-indexing-id',
    label: t('indexer.general'),
    path: `/dashboard/service/indexing/${indexerStore.active.indexer_uuid}`,
  },
  {
    key: 'dashboard-service-indexing-slug-deployments',
    label: t('indexer.deployments'),
    path: `/dashboard/service/indexing/${indexerStore.active.indexer_uuid}/deployments`,
    disabled: !indexerStore.active.squidId,
  },
  {
    key: 'dashboard-service-indexing-slug-logs',
    label: t('indexer.logs'),
    path: `/dashboard/service/indexing/${indexerStore.active.indexer_uuid}/logs`,
    disabled: !indexerStore.active.squidId,
  },
];
</script>
