<template>
  <div class="">
    <h2>{{ t('nft.collection.environment') }}</h2>
    <p>{{ t('nft.collection.environmentContent') }}</p>

    <div class="my-6 flex items-center gap-1 text-sm">
      <span>{{ t('nft.testnet') }}</span>
      <n-switch v-model:value="isMainnet" />
      <span>{{ t('nft.mainnet') }}</span>
    </div>
    <n-input v-model:value="search" type="text" name="search" size="small" :placeholder="$t('nft.search')" clearable>
      <template #prefix>
        <span class="icon-search text-2xl"></span>
      </template>
    </n-input>
    <div class="my-8">
      <template v-for="chain in chains" :key="chain.value">
        <n-tooltip v-if="disabledChain(chain.value)" placement="bottom" :trigger="isMd ? 'hover' : 'click'"">
          <template #trigger>
            <NftCardNetwork
              :name="chain.name.toLowerCase()"
              :label="chain.label"
              :price="1"
              :chainId="chain.value"
              :disabled="true"
            >
              <Notification v-if="collectionStore.quotaReached" type="error">
                {{ $t('error.ETHEREUM_COLLECTION_QUOTA_REACHED') }}
              </Notification>
              <Notification v-else-if="!paymentStore.hasPlan(PLAN_NAMES.BUTTERFLY)" type="warning">
                {{ $t('error.REQUIRES_BUTTERFLY_PLAN') }}
              </Notification>
            </NftCardNetwork>
          </template>
        </n-tooltip>
        <NftCardNetwork
          v-else
          :name="chain.name.toLowerCase()"
          :label="chain.label"
          :price="1"
          :chainId="chain.value"
          :selected="collectionStore.form.behavior.chain === chain.value"
          @click="() => onChainChange(chain.value)"
        />
      </template>
    </div>

    <div
      v-if="isSubstrateEnabled"
      class="overflow-hidden transition-all"
      :class="collectionStore.form.behavior.chain === EvmChainMainnet.ASTAR ? 'max-h-[20rem]' : 'max-h-0'"
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
const { isMd } = useScreen();
const { enterpriseChainIDs, nftChains, chainsTestnet, chainTypes } = useCollection();

const isMainnet = ref<boolean>(false);
const isSubstrateEnabled = ref<boolean>(false);
const search = ref<string>('');

const disabledChain = (chainId: number) => collectionStore.quotaReached && enterpriseChainIDs.includes(chainId);
const hiddenChain = (chainId: number) =>
  !paymentStore.hasPlan(PLAN_NAMES.BUTTERFLY) && enterpriseChainIDs.includes(chainId);

const chains = computed(() =>
  (isMainnet.value ? nftChains : chainsTestnet)
    .filter(chain => !search.value || chain.label.toLowerCase().includes(search.value.toLowerCase()))
    .filter(chain => !hiddenChain(chain.value))
);

onMounted(() => {
  collectionStore.getQuota();
});

function onChainChange(chainId: number) {
  if (!disabledChain(chainId)) {
    collectionStore.form.behavior.chain = chainId;
  }
}
</script>
