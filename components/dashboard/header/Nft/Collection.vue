<template>
  <Heading
    :back="{ name: 'dashboard-service-nft' }"
    :info="$t('w3Warn.nft.new')"
    :service="ServiceTypeName.NFT"
    :chain="collectionStore.active.chain"
    filter-by-chain
  >
    <n-space align="center" size="large">
      <h3 v-if="metadataStore.form.smartContract.chain">
        {{ $t('nft.collection.title') }}:
        <span class="capitalize">{{ chainIdToName(metadataStore.form.smartContract.chain) }}</span>
      </h3>
      <h3 v-else-if="collectionStore.active.chain && collectionStore.active.name">
        {{ collectionStore.active.name }}
        <small
          >(<span class="capitalize">{{ chainIdToName(collectionStore.active.chain) }}</span
          >)</small
        >
      </h3>
    </n-space>
  </Heading>
</template>

<script lang="ts" setup>
const paymentStore = usePaymentStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();

onMounted(() => {
  /** Get Price list */
  paymentStore.getPriceList();
});
</script>
