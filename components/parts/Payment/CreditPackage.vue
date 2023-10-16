<template>
  <div class="card-dark p-8">
    <h3 class="mb-2">{{ creditPackage.name }}</h3>
    <p class="text-body mb-6">
      {{ creditPackage.description }}
    </p>
    <p class="text-body mb-6">Credit amount: {{ creditPackage.creditAmount }}</p>
    <p class="text-body mb-6">Bonus credits: {{ creditPackage.bonusCredits }}</p>
    <Btn type="primary" :loading="loading" @click="getCreditSessionUrl(creditPackage.id)">
      Buy
    </Btn>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  creditPackage: { type: Object as PropType<CreditPackageInterface>, required: true },
});

const loading = ref<boolean>(false);
const paymentStore = usePaymentsStore();

async function getCreditSessionUrl(packageId: number) {
  loading.value = true;
  const stripeSessionUrl = await paymentStore.fetchCreditSessionUrl(packageId);
  loading.value = false;

  if (stripeSessionUrl) {
    window.open(stripeSessionUrl, '_self');
  }
}
</script>
