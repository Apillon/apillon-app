<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderIndexer v-if="indexerStore.active.indexer_uuid" :indexer-uuid="indexerStore.active.indexer_uuid" />
    </template>

    <n-space v-if="indexerStore.hasIndexers" class="pb-8" :size="32" vertical>
      <ActionsIndexerDeployments />
      <TableIndexerDeployments />
    </n-space>
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
