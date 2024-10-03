<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <h1>{{ $t('dashboard.nav.indexer') }}</h1>
    </template>
    <slot>
      <div class="pb-8">
        <n-space
          v-if="indexerStore.hasIndexers || indexerStore.search || indexerStore.loading"
          :size="32"
          vertical
        >
          <ActionsIndexer />
          <TableIndexer />
        </n-space>
        <Empty
          v-else
          :title="$t('dashboard.service.indexer.create')"
          :info="$t('dashboard.service.indexer.info')"
          icon="storage/empty"
        >
          <Btn type="primary" @click="showModalNewIndexer = true">
            {{ $t('dashboard.service.indexer.new') }}
          </Btn>
        </Empty>
      </div>
      <!-- Modal - Create Indexer -->
      <modal v-model:show="showModalNewIndexer" :title="$t('dashboard.service.indexer.new')">
        <FormIndexer />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const indexerStore = useIndexerStore();

useHead({
  title: t('dashboard.nav.smartContracts'),
});
const pageLoading = ref<boolean>(true);
const showModalNewIndexer = ref<boolean | null>(false);

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await indexerStore.getIndexers();
    pageLoading.value = false;
  });
});
</script>
