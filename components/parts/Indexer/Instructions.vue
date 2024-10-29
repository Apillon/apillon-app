<template>
  <div v-bind="$attrs" class="flex gap-y-8 flex-wrap pb-8">
    <div class="lg:pr-6">
      <SolutionContent class="lg:flex gap-4" inner-class="lg:w-1/2" :content="content" />

      <h4 class="my-4">{{ $t('indexer.startNew') }}</h4>

      <n-space>
        <Btn @click="showModalNewIndexer = true">
          {{ $t('dashboard.service.indexer.create') }}
        </Btn>
        <!-- <Btn
                    type="secondary"
                    inner-class="text-white flex items-center justify-center"
                    href="https://wiki.apillon.io/web3-services/7-web3-compute.html"
                  >
                    <span class="icon-file text-xl mr-2"></span>
                    <span>{{ $t('computing.cloudFunctions.documentation') }}</span>
                  </Btn> -->
      </n-space>
    </div>
  </div>
  <!-- Modal - Create Indexer -->
  <modal v-model:show="showModalNewIndexer" :title="$t('dashboard.service.indexer.new')">
    <FormIndexer />
  </modal>
</template>

<script lang="ts" setup>
const { generateContent } = useSolution();
const content = generateContent(SolutionKey.INDEXING);

const showModalNewIndexer = ref<boolean | null>(false);
</script>
