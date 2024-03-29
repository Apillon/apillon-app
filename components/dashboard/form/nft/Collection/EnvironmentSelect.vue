<template>
  <div class="mb-8">
    <h2>{{ $t('nft.collection.environment') }}</h2>
    <p>{{ $t('nft.collection.environmentContent') }}</p>
    <div class="flex gap-4 whitespace-pre-line my-8 justify-center">
      <div
        v-for="chain in chains"
        :key="chain.value"
        class="border-2 p-4 rounded-md border-bg-lightest hover:cursor-pointer w-40 flex justify-center"
        :class="collectionStore.form.base.chain === chain.value ? 'border-yellow' : ''"
        @click="collectionStore.form.base.chain = chain.value"
      >
        <div>
          <NuxtIcon
            :name="`logo/${chain.name}`"
            class="flex justify-center mx-auto text-7xl"
            filled
          />
          <p>{{ chain.label }}</p>
        </div>
      </div>
    </div>
    <Btn @click="handleSubmit()">{{ $t('form.proceed') }}</Btn>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const collectionStore = useCollectionStore();

const chains = enumKeys(Chains).map(k => {
  return { name: k.toLowerCase(), label: t(`nft.chain.${Chains[k]}`), value: Chains[k] };
});

function handleSubmit() {
  collectionStore.step = CollectionStep.METADATA;
  collectionStore.metadataStored = false;
}
</script>
