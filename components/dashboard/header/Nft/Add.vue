<template>
  <Heading>
    <slot>
      <n-space align="center" size="large">
        <NuxtLink :to="`/dashboard/service/nft/${collectionStore.active.collection_uuid}`">
          <span class="icon-back align-sub text-2xl"></span>
        </NuxtLink>
        <h2>{{ $t('nft.addNfts') }}</h2>
      </n-space>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <ModalCreditCosts
          :service="ServiceTypeName.NFT"
          :chain="collectionStore.active.chain || metadataStore.form.smartContract.chain"
          filter-by-chain
        />

        <Badge v-if="isLg" icon="nft/moonbeam">
          <NuxtIcon name="nft/astar_logo" class="icon-auto ml-2" filled />
        </Badge>
      </n-space>
    </template>
  </Heading>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/lib/types/service';

const { t } = useI18n();
const { isLg } = useScreen();
const paymentStore = usePaymentStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();

onMounted(() => {
  /** Get Price list */
  paymentStore.getPriceList();
});
</script>
