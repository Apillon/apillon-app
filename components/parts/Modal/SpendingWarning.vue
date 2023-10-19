<template>
  <n-modal v-bind="$attrs" ref="modalRef" :mask-closable="false">
    <n-card
      class="!max-w-xl"
      :title="$t('dashboard.payment.spendingAlert')"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <div v-if="servicePrice">
        <p>{{ servicePrice.description }}</p>
        <p>{{ servicePrice.currentPrice }} {{ $t('dashboard.credits.credits') }}</p>
      </div>

      <template #footer>
        <div class="flex gap-6">
          <div class="w-1/2">
            <Btn type="info" size="large" @click="$emit('close')">
              {{ $t('dashboard.payment.decline') }}
            </Btn>
          </div>
          <div class="w-1/2">
            <Btn type="primary" size="large" @click="submit">
              {{ $t('dashboard.payment.buy') }}
            </Btn>
          </div>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
const emit = defineEmits(['close']);

const paymentsStore = usePaymentsStore();
const warningStore = useWarningStore();
const servicePrice = ref<ProductPriceInterface | null>();

watch(
  () => warningStore.isSpendingWarningOpen,
  async shown => {
    if (shown && warningStore.serviceName) {
      servicePrice.value = await paymentsStore.getServicePrice(warningStore.serviceName);
    }
  },
  { immediate: true }
);

function submit() {
  emit('close');
  warningStore.action();
}
</script>
