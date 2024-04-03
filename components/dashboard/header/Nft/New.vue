<template>
  <Heading>
    <slot>
      <n-space align="center" size="large">
        <h2>
          <span class="text-bodyDark">{{ $t('dashboard.nav.nft') }}/</span>
          {{ $t('general.create') }}
        </h2>
      </n-space>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <ModalCreditCosts
          :service="ServiceTypeName.NFT"
          :chain="collectionStore.active.chain || collectionStore.form.base.chain"
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
const { isLg } = useScreen();
const paymentStore = usePaymentStore();
const collectionStore = useCollectionStore();

onMounted(() => {
  /** Get Price list */
  paymentStore.getPriceList();
});
</script>
