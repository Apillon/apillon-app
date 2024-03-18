<template>
  <div>
    <h2>{{ $t('nft.amount.title') }}</h2>
    <p>{{ $t('nft.amount.content') }}</p>
    <div class="flex gap-4 whitespace-pre-line mt-4 justify-center">
      <div
        v-for="amount in NftAmount"
        :key="amount.value"
        class="border-2 p-4 rounded-md border-bg-lightest hover:cursor-pointer w-52 flex justify-center"
        :class="collectionStore.amount === amount.value ? 'bg-bg-lighter' : ''"
        @click="collectionStore.amount = amount.value"
      >
        <div class="my-auto">
          {{ amount.label }}
          <p>{{ amount.sublabel }}</p>
        </div>
      </div>
    </div>
    <Btn class="mt-4" @click="handleSubmit()">{{ $t('form.proceed') }}</Btn>
  </div>
</template>

<script setup lang="ts">
const collectionStore = useCollectionStore();
const { NftAmount } = useCollection();

function handleSubmit() {
  if (collectionStore.amount === 0) {
    collectionStore.nftStep = NftCreateStep.SINGLE;
  } else {
    collectionStore.nftStep = NftCreateStep.MULTIPLE;
  }
}
</script>
