<template>
  <n-modal v-bind="$attrs" ref="modalRef" :mask-closable="false">
    <n-card
      class="!max-w-xl"
      :title="$t('dashboard.payment.spendingAlert')"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      size="large"
    >
      <div v-if="servicePrices">
        <div v-if="isEnoughCredits" class="mb-4 flex flex-col gap-1 text-body">
          <span v-for="servicePrice in servicePrices">
            {{ servicePrice.description || servicePrice.name }}
          </span>
        </div>
        <p v-else>{{ $t('dashboard.payment.notEnoughCredits') }}</p>
        <p>
          <strong>{{ $t('dashboard.credits.cost') }}: </strong>
          <span>{{ totalCredits }} {{ $t('dashboard.credits.credits') }}</span>
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
            <Btn v-else type="secondary" size="large" :to="{ name: 'dashboard-payments' }" @click="$emit('close')">
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
const servicePrices = ref<ProductPriceInterface[]>([]);

const totalCredits = computed(() => {
  return sumCredits(servicePrices.value);
});

const isEnoughCredits = computed(() => {
  return (paymentStore.credit.balance || 0) >= totalCredits.value;
});

watch(
  () => warningStore.services,
  services => {
    if (services.length) {
      selectServices(services);
    }
  },
  { immediate: true }
);

async function selectServices(serviceNames: string[]) {
  servicePrices.value = await paymentStore.filterServicePrice(serviceNames);
}

async function submit() {
  submitAction();
  emit('close');
}

async function submitAction() {
  await warningStore.action();
  await paymentStore.fetchCredits();
}
</script>
