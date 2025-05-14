<template>
  <button v-if="$slots.button" class="pointer" @click="modalCostsVisible = true">
    <slot name="button"></slot>
  </button>
  <n-button v-else class="rounded-lg" @click="modalCostsVisible = true">
    <span class="icon-credits mr-2 text-xl"></span>
    {{ $t('dashboard.credits.checkPrice') }}
  </n-button>
  <n-drawer v-model:show="modalCostsVisible" :width="774">
    <n-drawer-content :title="$t('dashboard.credits.pricing')" closable>
      <div>
        <p v-if="$te(`dashboard.credits.services.${service || category}.description`)" class="mb-8 text-body">
          {{ $t(`dashboard.credits.services.${service || category}.description`) }}
        </p>

        <PaymentCreditCosts
          v-if="modalCostsVisible"
          :chain="chain"
          :filter-by-chain="filterByChain"
          :filter-by-service="filterByService"
          :service="service"
          :category="category"
          :show-create-collection="showCreateCollection"
        />
        <Spinner v-else class="min-h-[7rem]" />
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
defineProps({
  chain: { type: Number, default: null },
  category: { type: String, default: null },
  service: { type: String, default: null },
  filterByChain: { type: Boolean, default: false },
  filterByService: { type: Boolean, default: false },
  showCreateCollection: { type: Boolean, default: false },
});

const modalCostsVisible = ref<boolean>(false);
</script>
