<template>
  <div class="flex-cc pt-4" style="min-height: calc(100dvh - 300px)">
    <div v-if="collectionStore.step === CollectionStep.ENVIRONMENT" class="text-center">
      <FormNftCollectionEnvironmentSelect />
    </div>
    <div v-else-if="collectionStore.step === CollectionStep.METADATA">
      <h2 class="mb-8 text-center">{{ $t('nft.collection.enterData') }}</h2>
      <FormNftCollectionBase />
    </div>
    <div v-else>
      <h2 class="mb-8 text-center">{{ $t('nft.collection.setBehavior') }}</h2>
      <FormNftCollectionBehavior />
    </div>
  </div>
</template>

<script lang="ts" setup>
const collectionStore = useCollectionStore();
</script>
