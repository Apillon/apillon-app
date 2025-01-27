<template>
  <div class="text-center">
    <h2>{{ t('nft.collection.environment') }}</h2>
    <p>{{ t('nft.collection.environmentContent') }}</p>
    <div class="my-8 flex flex-wrap justify-center gap-4 whitespace-pre-line">
      <div
        v-for="chain in nftChains"
        :key="chain.value"
        class="flex w-40 justify-center rounded-md border-2 border-bg-lightest p-4 hover:cursor-pointer"
        :class="selectedChain === chain.value ? 'border-yellow' : ''"
        @click="selectedChain = chain.value"
      >
        <div>
          <div class="h-20">
            <Image
              v-if="chain.value === SubstrateChain.UNIQUE"
              :src="uniquePNG"
              class="mx-auto"
              :width="112"
              :height="42"
            />
            <NuxtIcon v-else :name="`logo/${chain.name}`" class="mx-auto flex justify-center text-7xl" filled />
          </div>
          <p>{{ chain.label }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="isSubstrateEnabled"
      class="overflow-hidden transition-all"
      :class="selectedChain === Chains.ASTAR ? 'max-h-[20rem]' : 'max-h-0'"
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

    <Btn @click="selectChain">{{ t('form.proceed') }}</Btn>
  </div>
</template>

<script setup lang="ts">
import uniquePNG from 'assets/images/logo/unique.png';
import { Chains, SubstrateChain } from '~/lib/types/nft';

const emit = defineEmits(['submit']);
const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const collectionStore = useCollectionStore();
const { nftChains, chainTypes } = useCollection();
const { generateContent } = useSolution();

const isSubstrateEnabled = ref<boolean>(false);
const selectedChain = ref<number | undefined>();

function selectChain() {
  if (selectedChain.value) {
    collectionStore.metadataStored = false;
    emit('submit', selectedChain.value);
  } else {
    message.warning(t('validation.collection.chainRequired'));
  }
}
const content = computed(() => {
  return selectedChain.value ? generateContent(`${selectedChain.value}`, 'nft.network') : [];
});
</script>
