<template>
  <Heading
    :back="{ name: 'dashboard-service-nft' }"
    :service="ServiceTypeName.NFT"
    :chain="collectionStore.active.chain"
    :hide-general="true"
    filter-by-chain
  >
    <div class="flex items-end gap-1">
      <small class="inline-block pb-1 leading-normal">{{ $t('dashboard.nav.nft') }}</small>
      <h3 v-if="metadataStore.form.smartContract.chain">
        <span>/</span>
        {{ $t('nft.collection.title') }}:
        <span class="capitalize">{{ chainIdToName(metadataStore.form.smartContract.chain) }}</span>
      </h3>
      <h3 v-else-if="collectionStore.active.chain && collectionStore.active.name">
        <span>/</span>
        {{ collectionStore.active.name }}
        <small
          >(<span class="capitalize">{{ chainIdToName(collectionStore.active.chain) }}</span
          >)</small
        >
      </h3>
    </div>
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
