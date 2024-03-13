<template>
  <div>
    <div
      v-if="collectionStore.step === CollectionStep.ENVIRONMENT"
      class="text-center justify-center items-center flex"
      style="min-height: calc(100dvh - 300px)"
    >
      <FormNftCollectionEnvironmentSelect />
    </div>
    <div
      v-else-if="collectionStore.step === CollectionStep.METADATA"
      class="justify-center items-center flex"
      style="min-height: calc(100dvh - 300px)"
    >
      <div>
        <h2 class="mb-4">{{ $t('nft.collection.enterData') }}</h2>
        <FormNftCollectionBase />
      </div>
    </div>
    <div v-else class="justify-center items-center flex" style="min-height: calc(100dvh - 300px)">
      <div>
        <h2 class="mb-4">{{ $t('nft.collection.setBehavior') }}</h2>
        <FormNftCollectionBehavior />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const collectionStore = useCollectionStore();
</script>
