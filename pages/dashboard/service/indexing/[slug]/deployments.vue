<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderIndexer
        v-if="indexerStore.active.indexer_uuid"
        :indexer-uuid="indexerStore.active.indexer_uuid"
      />
    </template>
    <slot>
      <ActionsIndexerDeployments />
      <TableIndexerDeployments />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const { pageLoading, initIndexer } = useIndexer();
const indexerStore = useIndexerStore();

useHead({
  title: $i18n.t('dashboard.nav.hosting'),
});

onMounted(() => {
  initIndexer();
});
</script>
