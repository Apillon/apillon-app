<template>
  <div v-bind="$attrs" class="flex gap-x-6 gap-y-8 flex-wrap lg:flex-nowrap pb-8">
    <div class="lg:w-1/2">
      <SolutionContent :content="content" />

      <h6 class="my-4">{{ $t('indexer.startNew') }}</h6>

      <n-space>
        <Btn @click="showModalNewIndexer = true">
          {{ $t('indexer.new') }}
        </Btn>
        <BtnDocumentation
          href="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html#indexing-service"
        />
      </n-space>
    </div>
    <div class="lg:w-1/2 lg:pr-6">
      <LearnVideo
        title="Embedded Wallet"
        html-content="https://www.youtube.com/embed/9y-9nz0tpVs"
        class="w-full max-w-lg mx-auto"
      />
    </div>
  </div>
  <!-- Modal - Create Indexer -->
  <IndexerSpendingWarning v-model:show="showModalNewIndexer">
    <FormIndexer />
  </IndexerSpendingWarning>
</template>

<script lang="ts" setup>
const { generateContent } = useSolution();
const content = generateContent(SolutionKey.INDEXING);

const showModalNewIndexer = ref<boolean | null>(false);
</script>
