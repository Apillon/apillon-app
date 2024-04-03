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
        @click="onChainChange(chain.value)"
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

    <div
      class="transition-all overflow-hidden"
      :class="isOnlyEvmChain ? 'max-h-0' : 'max-h-[20rem]'"
    >
      <h4 class="relative top-2">{{ $t('nft.collection.chainType') }}</h4>
      <div class="flex gap-4 whitespace-pre-line my-8 justify-center">
        <div
          v-for="chainType in chainTypes"
          :key="chainType.value"
          class="border-2 p-4 rounded-md border-bg-lightest hover:cursor-pointer w-40 flex justify-center"
          :class="collectionStore.form.base.chainType === chainType.value ? 'border-yellow' : ''"
          @click="collectionStore.form.base.chainType = chainType.value"
        >
          <div>
            <NuxtIcon
              :name="`logo/${chainType.name}`"
              class="flex justify-center mx-auto text-7xl"
              filled
            />
            <p>{{ chainType.label }}</p>
          </div>
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

const chainTypes = enumKeys(ChainType).map(k => {
  return { name: k.toLowerCase(), label: t(`nft.chainType.${ChainType[k]}`), value: ChainType[k] };
});

const isOnlyEvmChain = computed(
  () =>
    collectionStore.form.base.chain === Chains.MOONBASE ||
    collectionStore.form.base.chain === Chains.MOONBEAM
);

function onChainChange(chain: number) {
  collectionStore.form.base.chain = chain;

  if (chain === Chains.MOONBASE || chain === Chains.MOONBEAM) {
    collectionStore.form.base.chainType = ChainType.EVM;
  }
}

function handleSubmit() {
  collectionStore.step = CollectionStep.METADATA;
  collectionStore.metadataStored = false;
}
</script>
