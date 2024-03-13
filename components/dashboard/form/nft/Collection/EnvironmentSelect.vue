<template>
  <div>
    <h2>{{ $t('nft.collection.environment') }}</h2>
    <p>{{ $t('nft.collection.environmentContent') }}</p>
    <div class="flex gap-4 whitespace-pre-line mt-4 justify-center">
      <div
        v-for="chain in chains"
        :key="chain.value"
        class="border-2 p-4 rounded-md border-bg-lightest hover:cursor-pointer w-40 flex justify-center"
        :class="collectionStore.form.base.chain === chain.value ? 'bg-bg-lighter' : ''"
      >
        <div @click="collectionStore.form.base.chain = chain.value">
          {{ chain.label }}
        </div>
      </div>
    </div>
    <Btn class="mt-4" @click="handleSubmit()">{{ $t('form.proceed') }}</Btn>
  </div>
</template>

<script setup lang="ts">
const collectionStore = useCollectionStore();
const { chains } = useCollection();

function handleSubmit() {
  collectionStore.step = CollectionStep.METADATA;
  collectionStore.metadataStored = false;
}
</script>
