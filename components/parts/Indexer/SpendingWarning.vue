<template>
  <modal
    v-bind="$attrs"
    :class="{ 'text-center': !proceed }"
    :title="
      proceed
        ? $t('indexer.new')
        : isEnoughCredits
          ? $t('dashboard.credits.pricingNotification')
          : $t('dashboard.credits.notEnoughCredits')
    "
  >
    <template v-if="proceed">
      <slot />
    </template>
    <div v-else>
      <div v-if="isEnoughCredits" class="flex flex-col gap-1 mb-4">
        <span v-html="$t('indexer.spendingWarning.content')"></span>
      </div>
      <div v-else>
        <span>{{ $t('indexer.spendingWarning.notEnough1') }}</span>
        <strong>{{ $t('indexer.spendingWarning.notEnough2') }}</strong>
      </div>
      <div class="mt-4 mb-8">
        <span class="text-primary">
          {{ $t('indexer.spendingWarning.info') }}
        </span>
      </div>

      <Btn v-if="isEnoughCredits" type="primary" size="large" @click="proceed = true">
        {{ $t('indexer.spendingWarning.btnProceed') }}
      </Btn>
      <Btn
        v-else
        type="secondary"
        size="large"
        :to="{ name: 'dashboard-payments' }"
        @click="$emit('close')"
      >
        {{ $t('indexer.spendingWarning.btnBuyCredits') }}
      </Btn>
    </div>
  </modal>
</template>

<script lang="ts" setup>
const paymentStore = usePaymentStore();
const proceed = ref<boolean>(false);

const isEnoughCredits = computed(() => {
  return (paymentStore.credit.balance || 0) >= 50000;
});
</script>
