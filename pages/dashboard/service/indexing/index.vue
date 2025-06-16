<template>
  <Dashboard :empty="!dataStore.project.selected || !dataStore.hasIndexers" :loading="pageLoading">
    <template #empty>
      <ServiceEmpty
        docs="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html#indexing-service"
        :name="toCamelCase(ServiceTypeName.INDEXING)"
        :service="ServiceTypeName.INDEXING"
        :guides="serviceGuides"
        powered-by="sqd"
      >
        <template #actions>
          <Btn size="large" @click="modalIndexerVisible = true">
            {{ $t('indexer.new') }}
          </Btn>
        </template>
        <IndexerSpendingWarning v-model:show="modalIndexerVisible" :title="$t('indexer.new')">
          <FormIndexer @submit-success="modalIndexerVisible = false" />
        </IndexerSpendingWarning>
      </ServiceEmpty>
    </template>
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
      <n-space class="pb-8" :size="32" vertical>
        <ActionsIndexer />
        <TableIndexer />
      </n-space>
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
const modalIndexerVisible = ref<boolean>(false);

const serviceGuides = [
  {
    title: 'Stop wrestling with blockchain data: SQD indexing makes it easy',
    content:
      'Discover SQD’s indexing service — a developer-first solution on the Apillon platform to simplify blockchain data access and power your…',
    link: 'https://blog.apillon.io/stop-wrestling-with-blockchain-data-sqd-indexing-makes-it-easy-4034bc8a89bb/',
  },
];

onMounted(async () => {
  await dataStore.waitOnPromises();
  await indexerStore.getIndexers();

  pageLoading.value = false;
});
</script>
