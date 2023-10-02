<template>
  <div class="card-dark p-8">
    <h3 class="mb-2">{{ creditPackage.name }}</h3>
    <p class="text-body mb-6">
      {{ creditPackage.description }}
    </p>
    <p class="text-body mb-6">Credit amount: {{ creditPackage.creditAmount }}</p>
    <p class="text-body mb-6">Bonus credits: {{ creditPackage.bonusCredits }}</p>
    <Btn type="primary" @click="getCreditSessionUrl(creditPackage.id)"> Buy </Btn>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  creditPackage: { type: Object as VuePropType<CreditPackageInterface>, required: true },
});

const paymentStore = usePaymentsStore();

async function getCreditSessionUrl(packageId: number) {
  const sessionUrl = await paymentStore.getCreditSessionUrl(packageId);
  console.log(sessionUrl);
}
</script>
