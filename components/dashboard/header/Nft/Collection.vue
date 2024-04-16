<template>
  <Heading>
    <slot>
      <n-space align="center" size="large">
        <NuxtLink :to="{ name: 'dashboard-service-nft' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <h2>{{ $t('dashboard.solution.nftCollection.name') }}</h2>
      </n-space>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <!-- Modal Price list for Hosting -->
        <ModalCreditCosts
          :service="ServiceTypeName.NFT"
          :chain="collectionStore.active.chain"
          filter-by-chain
        />
        <IconInfo v-if="$i18n.te('w3Warn.nft.info')" @click="modalW3WarnVisible = true" />
      </n-space>
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    {{ $t('w3Warn.nft.new') }}
  </W3Warn>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const paymentStore = usePaymentStore();
const collectionStore = useCollectionStore();

const modalW3WarnVisible = ref<boolean>(false);

onMounted(() => {
  /** Get Price list */
  paymentStore.getPriceList();
});
</script>
