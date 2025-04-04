<template>
  <div v-bind="$attrs" class="pb-8">
    <div class="flex flex-col gap-2">
      <h4>
        {{ $t('indexer.instructions.title') }}
      </h4>
      <p>
        {{ $t('indexer.instructions.content') }}
      </p>
    </div>

    <div class="mt-2 flex flex-row items-center gap-2 text-body">
      {{ $t('general.poweredBy') }}
      <NuxtIcon name="logo/sqd" class="icon-auto h-6 w-16 text-white" alt="sqd" />
    </div>
    <SolutionContent :content="content" />

    <h6 class="my-4">{{ $t('indexer.startNew') }}</h6>

    <n-space>
      <Btn @click="showModalNewIndexer = true">
        {{ $t('indexer.new') }}
      </Btn>
      <BtnDocumentation href="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html#indexing-service" />
    </n-space>
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
