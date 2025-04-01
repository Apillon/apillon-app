<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderIndexer v-if="indexerStore.active.indexer_uuid" :indexer-uuid="indexerStore.active.indexer_uuid" />
    </template>
    <slot>
      <ActionsIndexerDeployments />
      <TableIndexerDeployments />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { pageLoading, initIndexer } = useIndexer();
const indexerStore = useIndexerStore();

useHead({
  title: t('dashboard.nav.indexing'),
});

onMounted(() => {
  initIndexer();
});
</script>
