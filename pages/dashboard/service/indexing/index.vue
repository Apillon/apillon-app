<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading :service="ServiceTypeName.INDEXING">
        <h3 class="inline-block">
          {{ $t('dashboard.nav.indexing') }}
          <img src="/icons/beta.svg" alt="Beta" class="ml-2 inline-block h-5 w-14" />
        </h3>
        <template #details>
          <IndexerInstructions />
        </template>
      </Heading>
    </template>
    <slot>
      <div class="pb-8">
        <n-space v-if="indexerStore.hasIndexers || indexerStore.search || indexerStore.loading" :size="32" vertical>
          <ActionsIndexer />
          <TableIndexer />
        </n-space>
        <IndexerInstructions v-else class="border-b-1 border-bg-lighter pb-8" />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const indexerStore = useIndexerStore();

useHead({
  title: t('dashboard.nav.indexing'),
});
const pageLoading = ref<boolean>(true);

onMounted(async () => {
  await dataStore.waitOnPromises();
  await indexerStore.getIndexers();

  pageLoading.value = false;
});
</script>
