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
        <p v-if="isEnoughCredits">{{ servicePrice.description }}</p>
        <p v-else>{{ $t('dashboard.payment.notEnoughCredits') }}</p>
        <p>
          <strong>{{ $t('dashboard.credits.cost') }}: </strong>
          <span>{{ servicePrice.currentPrice }} {{ $t('dashboard.credits.credits') }}</span>
        </p>
      </div>

      <template #footer>
        <div class="flex gap-6">
          <div class="w-1/2">
            <Btn type="info" size="large" @click="$emit('close')">
              {{ $t('dashboard.payment.decline') }}
            </Btn>
          </div>
          <div class="w-1/2">
            <Btn v-if="isEnoughCredits" type="primary" size="large" @click="submit">
              {{ $t('dashboard.payment.proceed') }}
            </Btn>
            <Btn
              v-else
              type="secondary"
              size="large"
              :to="{ name: 'dashboard-billing' }"
              @click="$emit('close')"
            >
              {{ $t('dashboard.payment.buyCredits') }}
            </Btn>
          </div>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
const emit = defineEmits(['close']);

const paymentStore = usePaymentStore();
const warningStore = useWarningStore();
const servicePrice = ref<ProductPriceInterface | null>();

const isEnoughCredits = computed(() => {
  return (paymentStore.credit.balance || 0) >= (servicePrice.value?.currentPrice || 0);
});

onMounted(() => {
  paymentStore.getPriceList();
});

watch(
  () => warningStore.serviceName,
  service => {
    if (service) {
      servicePrice.value = paymentStore.findServicePrice(warningStore.serviceName);

      /** Auto submit if action is FREE */
      if (servicePrice.value?.currentPrice === 0) {
        submit();
      }
    }
  },
  { immediate: true }
);

async function submit() {
  emit('close');
  await warningStore.action();
  await paymentStore.fetchCredits();
}
</script>
