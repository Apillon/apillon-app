<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const indexerStore = useIndexerStore();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-indexer-id',
    label: t('dashboard.service.indexer.general'),
    path: `/dashboard/service/indexer/${indexerStore.active.indexer_uuid}`,
  },
  {
    key: 'dashboard-service-indexer-slug-logs',
    label: t('dashboard.service.indexer.logs'),
    path: `/dashboard/service/indexer/${indexerStore.active.indexer_uuid}/logs`,
  },
  {
    key: 'dashboard-service-indexer-slug-deploys',
    label: t('dashboard.service.indexer.deploys'),
    path: `/dashboard/service/indexer/${indexerStore.active.indexer_uuid}/deploys`,
  },
];
</script>
