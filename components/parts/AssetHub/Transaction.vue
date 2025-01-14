<template>
  <Modal v-model:show="modalTransactionVisible" class="text-center">
    <IconSuccess class="text-4xl" />

    <h2 class="mb-2 mt-6">
      {{ $t('dashboard.service.assetHub.transactionProcessed') }}
    </h2>
    <i18n-t keypath="dashboard.service.assetHub.transactionDetails" tag="p">
      <a :href="transactionLink(transactionHash, chainId)" class="link" target="_blank">
        {{ $t('general.here') }}
      </a>
    </i18n-t>

    <Btn
      type="secondary"
      class="mt-8 w-full"
      @click="
        () => {
          modalTransactionVisible = false;
          $emit('close');
        }
      "
    >
      {{ $t('general.close') }}
    </Btn>
  </Modal>
</template>

<script lang="ts" setup>
defineEmits(['close']);
defineProps({
  transactionHash: { type: String, required: true },
});

const assetHubStore = useAssetHubStore();
const modalTransactionVisible = ref<boolean>(true);

const chainId = computed(() => (assetHubStore.mainnet ? SubstrateChain.ASSET_HUB : SubstrateChain.WESTEND_ASSET_HUB));
</script>
