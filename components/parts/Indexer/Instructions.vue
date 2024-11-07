<template>
  <div v-bind="$attrs" class="flex gap-x-6 gap-y-8 flex-wrap lg:flex-nowrap pb-8">
    <div class="lg:w-1/2">
      <SolutionContent :content="content" />

      <h6 class="my-4">{{ $t('indexer.startNew') }}</h6>

      <n-space>
        <Btn @click="showModalNewIndexer = true">
          {{ $t('indexer.new') }}
        </Btn>
        <Btn
          type="secondary"
          inner-class="text-white flex items-center justify-center"
          href="https://wiki-staging.apillon.io/web3-services/10-web3-infrastructure.html"
        >
          <span class="icon-file text-xl mr-2"></span>
          <span>{{ $t('computing.cloudFunctions.documentation') }}</span>
        </Btn>
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
  <modal v-model:show="showModalNewIndexer" :title="$t('indexer.new')">
    <FormIndexer />
  </modal>
</template>

<script lang="ts" setup>
const { generateContent } = useSolution();
const content = generateContent(SolutionKey.INDEXING);

const showModalNewIndexer = ref<boolean | null>(false);
</script>
