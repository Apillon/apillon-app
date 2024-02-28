<template>
  <n-button class="rounded-lg" size="small" @click="modalCostsVisible = true">
    <span class="icon-credits text-xl mr-2"></span>
    {{ $t('dashboard.credits.checkPrice') }}
  </n-button>
  <Modal v-model:show="modalCostsVisible" :title="$t('dashboard.credits.creditCosts')">
    <div>
      <p v-if="$te(`dashboard.credits.services.${service}.description`)" class="mb-8 text-body">
        {{ $t(`dashboard.credits.services.${service}.description`) }}
      </p>

      <PaymentCreditCosts
        v-if="modalCostsVisible"
        :chain="chain"
        :filter-by-chain="filterByChain"
        :filter-by-service="filterByService"
        :service="service"
      />
      <Spinner v-else class="min-h-[7rem]" />

      <Btn class="mt-8" type="secondary" size="large" @click="modalCostsVisible = false">
        {{ $t('dashboard.credits.confirmPrices') }}
      </Btn>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
defineProps({
  chain: { type: Number, default: null },
  service: { type: String, default: null },
  filterByChain: { type: Boolean, default: false },
  filterByService: { type: Boolean, default: false },
});

const modalCostsVisible = ref<boolean>(false);
</script>
