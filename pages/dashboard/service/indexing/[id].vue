<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderIndexer :indexer-uuid="indexerStore.active.indexer_uuid" />
    </template>

    <slot>
      <n-space v-if="indexerStore.active?.squidId" class="pb-8" :size="24" vertical>
        <ActionsIndexerGeneral />
        <h4>{{ $t('indexer.indexerGeneralData') }}</h4>
        <TableIndexerGeneral />
      </n-space>
      <IndexerInstructionsDeploy v-else />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const indexerStore = useIndexerStore();
const { pageLoading, initIndexer } = useIndexer();

useHead({
  title: t('dashboard.nav.indexing'),
});

onMounted(async () => {
  await initIndexer();
});
</script>
