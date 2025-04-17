<template>
  <Heading>
    <slot>
      <n-space align="center" size="large">
        <NuxtLink :to="{ name: 'dashboard-service-nft' }">
          <span class="icon-back align-sub text-2xl"></span>
        </NuxtLink>
        <h2 v-if="collectionStore.form.behavior.chain">
          {{ t('nft.collection.title') }}:
          <span class="capitalize">{{ chainIdToName(collectionStore.form.behavior.chain).replace('_', ' ') }}</span>
        </h2>
        <h2 v-else-if="collectionStore.active.chain && collectionStore.active.name">
          {{ collectionStore.active.name }}
          <small
            >(<span class="capitalize">{{ chainIdToName(collectionStore.active.chain).replace('_', ' ') }}</span
            >)</small
          >
        </h2>
        <h2 v-else>{{ t('dashboard.solution.nftCollection.name') }}</h2>
      </n-space>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <!-- Modal Price list for Hosting -->
        <ModalCreditCosts :service="ServiceTypeName.NFT" :chain="collectionStore.active.chain" filter-by-chain />
        <IconInfo v-if="te('w3Warn.nft.info')" @click="modalW3WarnVisible = true" />
      </n-space>
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    {{ t('w3Warn.nft.new') }}
  </W3Warn>
</template>

<script lang="ts" setup>
import { chainIdToName } from '~/lib/utils/chain';
import { ServiceTypeName } from '~/lib/types/service';

const { t, te } = useI18n();
const paymentStore = usePaymentStore();
const collectionStore = useCollectionStore();

const modalW3WarnVisible = ref<boolean>(false);

onMounted(() => {
  /** Get Price list */
  paymentStore.getPriceList();
});
</script>
