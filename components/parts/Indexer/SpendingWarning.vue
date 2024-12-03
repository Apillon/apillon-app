<template>
  <modal
    v-bind="$attrs"
    :class="{ 'text-center': !proceed }"
    :title="proceed ? $t('indexer.new') : $t('dashboard.credits.pricingNotification')"
  >
    <template v-if="proceed">
      <slot />
    </template>
    <div v-else>
      <div class="flex flex-col gap-1 mb-4">
        <span v-html="$t('indexer.spendingWarning.content')"></span>
      </div>

      <div class="flex flex-col gap-1 mb-4">
        <span v-html="$t('indexer.spendingWarning.content2')"></span>
      </div>
      <div class="mt-4 mb-8">
        <span class="text-primary">
          {{ $t('indexer.spendingWarning.info') }}
        </span>
      </div>

      <Btn
        v-if="!isEnoughCredits"
        type="primary"
        size="large"
        :to="{ name: 'dashboard-payments' }"
        class="mt-2"
        @click="$emit('close')"
      >
        {{ $t('indexer.spendingWarning.btnBuyCredits') }}
      </Btn>
      <Btn
        :type="isEnoughCredits ? 'primary' : 'secondary'"
        size="large"
        class="mt-2"
        @click="proceed = true"
      >
        {{ $t('indexer.spendingWarning.btnProceed') }}
      </Btn>
    </div>
  </modal>
</template>

<script lang="ts" setup>
const paymentStore = usePaymentStore();
const proceed = ref<boolean>(false);

const isEnoughCredits = computed(() => {
  return (paymentStore.credit.balance || 0) >= 5000;
});
</script>
