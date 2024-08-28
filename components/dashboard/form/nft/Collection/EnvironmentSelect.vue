<template>
  <div class="mb-8">
    <h2>{{ $t('nft.collection.environment') }}</h2>
    <p>{{ $t('nft.collection.environmentContent') }}</p>
    <div class="flex flex-wrap gap-4 whitespace-pre-line my-8 justify-center">
      <div
        v-for="chain in chains"
        :key="chain.value"
        class="border-2 p-4 rounded-md border-bg-lightest hover:cursor-pointer w-40 flex justify-center"
        :class="collectionStore.form.base.chain === chain.value ? 'border-yellow' : ''"
        @click="selectChain(chain.value)"
      >
        <n-tooltip v-if="disabledChain(chain.value)" placement="bottom" trigger="hover">
          <template #trigger>
            <div class="!cursor-default opacity-60">
              <NuxtIcon
                :name="`logo/${chain.name}`"
                class="flex justify-center mx-auto text-7xl"
                filled
              />
              <p>{{ chain.label }}</p>
            </div>
          </template>
          <span v-if="collectionStore.quotaReached">
            {{ $t('error.ETHEREUM_COLLECTION_QUOTA_REACHED') }}
          </span>
          <span v-else-if="!paymentStore.hasPlan(PLAN_NAMES.BUTTERFLY)">
            {{ $t('error.REQUIRES_BUTTERFLY_PLAN') }}
          </span>
        </n-tooltip>
        <div v-else>
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
      :class="collectionStore.form.base.chain === EvmChain.ASTAR ? 'max-h-[20rem]' : 'max-h-0'"
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
const collectionStore = useCollectionStore();
const paymentStore = usePaymentStore();
const { chains, chainTypes, onChainChange } = useCollection();

const disabledChain = (chainId: number) =>
  (!paymentStore.hasPlan(PLAN_NAMES.BUTTERFLY) || collectionStore.quotaReached) &&
  (chainId === EvmChain.ETHEREUM || chainId === EvmChain.SEPOLIA);

function selectChain(chain: number) {
  if (disabledChain(chain)) return;

  collectionStore.form.base.chain = chain;
  onChainChange(chain);
}

function handleSubmit() {
  collectionStore.step = CollectionStep.METADATA;
  collectionStore.metadataStored = false;
}
</script>
