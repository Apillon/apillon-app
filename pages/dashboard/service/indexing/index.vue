<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1 class="inline-block">
            {{ $t('dashboard.nav.indexing') }}
            <img src="/icons/beta.svg" alt="Beta" class="w-14 h-5 inline-block ml-2" />
          </h1>
        </slot>
        <template #info>
          <ModalCreditCosts :service="ServiceTypeName.INDEXING" />
        </template>
      </Heading>
    </template>
    <slot>
      <div class="pb-8">
        <n-collapse
          class="border-b-1 border-bg-lighter -mt-4 mb-4 pb-4"
          accordion
          @update:expanded-names="onUpdateAccordion"
        >
          <n-collapse-item
            :title="
              instructionsVisible ? $t('indexer.hideInstructions') : $t('indexer.showInstructions')
            "
          >
            <template #header>
              <span class="icon-info text-xl mr-2"></span>
              {{
                instructionsVisible
                  ? $t('indexer.hideInstructions')
                  : $t('indexer.showInstructions')
              }}
            </template>
            <div class="flex gap-y-8 flex-wrap pb-8 mb-8">
              <div class="lg:pr-6">
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
            </div>
          </n-collapse-item>
        </n-collapse>

        <n-space
          v-if="indexerStore.hasIndexers || indexerStore.search || indexerStore.loading"
          :size="32"
          vertical
        >
          <ActionsIndexer />
          <TableIndexer />
        </n-space>
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
const instructionsVisible = ref<boolean>(false);

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await indexerStore.getIndexers();
    pageLoading.value = false;
  });
});

function onUpdateAccordion(expandedNames: Array<string | number>) {
  instructionsVisible.value = expandedNames.length > 0;
}
</script>
