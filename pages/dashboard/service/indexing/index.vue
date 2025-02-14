<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1 class="inline-block">
            {{ $t('dashboard.nav.indexing') }}
            <img src="/icons/beta.svg" alt="Beta" class="ml-2 inline-block h-5 w-14" />
          </h1>
        </slot>
        <template #info>
          <n-space size="large">
            <BtnDocumentation
              size="small"
              href="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html#indexing-service"
              hover-lighter
            />
            <ModalCreditCosts :service="ServiceTypeName.INDEXING" />
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <div class="pb-8">
        <n-collapse
          v-if="indexerStore.hasIndexers"
          class="-mt-4 mb-4 border-b-1 border-bg-lighter pb-4"
          accordion
          @update:expanded-names="onUpdateAccordion"
        >
          <n-collapse-item>
            <template #header>
              <span class="icon-info mr-2 text-xl"></span>
              {{ instructionsVisible ? $t('general.instructions.hide') : $t('general.instructions.show') }}
            </template>
            <IndexerInstructions />
          </n-collapse-item>
        </n-collapse>
        <IndexerInstructions v-else class="border-b-1 border-bg-lighter pb-8" />

        <n-space v-if="indexerStore.hasIndexers || indexerStore.search || indexerStore.loading" :size="32" vertical>
          <ActionsIndexer />
          <TableIndexer />
        </n-space>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/lib/types/service';

const { t } = useI18n();
const dataStore = useDataStore();
const indexerStore = useIndexerStore();

useHead({
  title: t('dashboard.nav.indexing'),
});
const pageLoading = ref<boolean>(true);
const instructionsVisible = ref<boolean>(false);

onMounted(async () => {
  await dataStore.waitOnPromises();
  await indexerStore.getIndexers();

  pageLoading.value = false;
});

function onUpdateAccordion(expandedNames: Array<string | number>) {
  instructionsVisible.value = expandedNames.length > 0;
}
</script>
