<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <h1>{{ $t('dashboard.nav.indexing') }}</h1>
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
        <div v-else class="flex gap-y-8 flex-wrap pb-8 mb-8">
          <div class="lg:w-1/2 lg:pr-6">
            <SolutionContent :content="content" />

            <h4 class="my-4">{{ $t('indexer.startNew') }}</h4>

            <n-space class="mb-8">
              <Btn @click="showModalNewIndexer = true">
                {{ $t('dashboard.service.indexer.create') }}
              </Btn>
              <Btn
                type="secondary"
                inner-class="text-white flex items-center justify-center"
                href="https://wiki.apillon.io/web3-services/7-web3-compute.html"
              >
                <span class="icon-file text-xl mr-2"></span>
                <span>{{ $t('computing.cloudFunctions.documentation') }}</span>
              </Btn>
            </n-space>
          </div>
          <div class="lg:w-1/2">
            <h3 class="mb-2">{{ $t('computing.cloudFunctions.checkVideo') }}</h3>
            <LearnVideo
              :title="$t('computing.cloudFunctions.checkVideo')"
              html-content="https://www.youtube.com/embed/AslkbJH4OAM?si=IVlEtikZsgI85iWl"
              class="w-full"
            />
          </div>
        </div>
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
const { generateContent } = useSolution();

const content = generateContent('indexing');

useHead({
  title: t('dashboard.nav.indexing'),
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
