<template>
  <Heading
    :back="`/dashboard/service/nft/${collectionStore.active.collection_uuid}`"
    :service="ServiceTypeName.NFT"
    :chain="collectionStore.active.chain || metadataStore.form.smartContract.chain"
    filter-by-chain
  >
    <h2>{{ $t('nft.addNfts') }}</h2>

    <template #details>
      <Badge v-if="isLg" icon="nft/moonbeam">
        <NuxtIcon name="nft/astar_logo" class="icon-auto ml-2" filled />
      </Badge>
    </template>
  </Heading>
</template>

<script lang="ts" setup>
const { isLg } = useScreen();
const paymentStore = usePaymentStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();

onMounted(() => {
  /** Get Price list */
  paymentStore.getPriceList();
});
</script>
