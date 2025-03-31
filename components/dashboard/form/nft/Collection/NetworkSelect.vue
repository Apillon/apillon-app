<template>
  <div class="text-center">
    <h2>{{ t('nft.collection.environment') }}</h2>
    <p>{{ t('nft.collection.environmentContent') }}</p>
    <div class="mx-auto my-8 flex max-w-4xl flex-wrap justify-center gap-4 whitespace-pre-line xl:max-w-6xl">
      <div
        v-for="chain in chains"
        :key="chain.value"
        class="flex w-40 justify-center rounded-md border-2 p-4 hover:cursor-pointer"
        :class="
          selectedChain === chain.value
            ? 'border-yellow'
            : disabledChain(chain.value)
              ? 'border-bodyDark'
              : 'border-bg-lightest'
        "
        @click="() => onChainChange(chain.value)"
      >
        <n-tooltip v-if="disabledChain(chain.value)" placement="bottom" trigger="hover">
          <template #trigger>
            <div class="!cursor-default opacity-60">
              <NuxtIcon
                :name="`logo/${chain.name.toLowerCase()}`"
                class="mx-auto flex justify-center text-7xl"
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
          <div class="h-20">
            <NuxtIcon :name="`logo/${chain.name.toLowerCase()}`" class="mx-auto flex justify-center text-7xl" filled />
          </div>
          <p>{{ chain.label }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="isSubstrateEnabled"
      class="overflow-hidden transition-all"
      :class="selectedChain === EvmChainMainnet.ASTAR ? 'max-h-[20rem]' : 'max-h-0'"
    >
      <h4 class="relative top-2">{{ t('nft.collection.chainType') }}</h4>
      <div class="my-8 flex justify-center gap-4 whitespace-pre-line">
        <div v-for="chainType in chainTypes">
          <div
            v-if="chainType.label === 'SUBSTRATE'"
            :key="chainType.label"
            class="flex w-40 cursor-not-allowed justify-center rounded-md border-2 border-bg-lightest p-4"
            title="Temporarily unavailable"
          >
            <div>
              <NuxtIcon :name="`logo/${chainType.name}`" class="mx-auto flex justify-center text-7xl" filled />
              <p>{{ chainType.label }}</p>
            </div>
          </div>

          <!-- Div for all other cases (with click handler) -->
          <div
            v-else
            :key="chainType.value"
            class="flex w-40 justify-center rounded-md border-2 border-bg-lightest p-4 hover:cursor-pointer"
            :class="collectionStore.form.behavior.chainType === chainType.value ? 'border-yellow' : ''"
            @click="collectionStore.form.behavior.chainType = chainType.value"
          >
            <div>
              <NuxtIcon :name="`logo/${chainType.name}`" class="mx-auto flex justify-center text-7xl" filled />
              <p>{{ chainType.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedChain" class="card-dark mx-auto mb-6 max-w-3xl p-2 text-left sm:p-4 lg:p-8">
      <SolutionContent :content="content" />
    </div>

    <Btn :disabled="!!selectedChain && disabledChain(selectedChain)" @click="selectChain">{{ t('form.proceed') }}</Btn>
  </div>
</template>

<script setup lang="ts">
import { EvmChainMainnet } from '~/lib/types/nft';
import { PLAN_NAMES } from '~/lib/types/payment';

const emit = defineEmits(['submit']);
const message = useMessage();
const paymentStore = usePaymentStore();
const collectionStore = useCollectionStore();

const { t } = useI18n();
const { generateContent } = useSolution();
const { enterpriseChainIDs, nftChains, chainTypes } = useCollection();

const isSubstrateEnabled = ref<boolean>(false);
const selectedChain = ref<number | undefined>();

const disabledChain = (chainId: number) => collectionStore.quotaReached && enterpriseChainIDs.includes(chainId);
const hiddenChain = (chainId: number) =>
  !paymentStore.hasPlan(PLAN_NAMES.BUTTERFLY) && enterpriseChainIDs.includes(chainId);

const content = computed(() => {
  return selectedChain.value ? generateContent(`${selectedChain.value}`, 'nft.network') : [];
});
const chains = computed(() => nftChains.filter(c => !hiddenChain(c.value)));

onMounted(() => {
  collectionStore.getQuota();
});

function onChainChange(chainId: number) {
  if (!disabledChain(chainId)) {
    selectedChain.value = chainId;
  }
}

function selectChain() {
  if (!selectedChain.value) {
    message.warning(t('validation.collection.chainRequired'));
  } else if (disabledChain(selectedChain.value)) {
    return;
  } else {
    collectionStore.metadataStored = false;
    emit('submit', selectedChain.value);
  }
}
</script>
