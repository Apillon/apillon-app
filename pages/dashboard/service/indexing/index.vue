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
          v-if="indexerStore.hasIndexers"
          class="border-b-1 border-bg-lighter -mt-4 mb-4 pb-4"
          accordion
          @update:expanded-names="onUpdateAccordion"
        >
          <n-collapse-item>
            <template #header>
              <span class="icon-info text-xl mr-2"></span>
              {{
                instructionsVisible
                  ? $t('general.instructions.hide')
                  : $t('general.instructions.show')
              }}
            </template>
            <IndexerInstructions />
          </n-collapse-item>
        </n-collapse>
        <IndexerInstructions v-else class="border-b-1 border-bg-lighter pb-8" />

        <n-space
          v-if="indexerStore.hasIndexers || indexerStore.search || indexerStore.loading"
          :size="32"
          vertical
        >
          <ActionsIndexer />
          <TableIndexer />
        </n-space>
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
