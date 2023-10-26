<template>
  <div class="credits-package text-center text-body">
    <h4 class="mb-6">{{ creditPackage.name }}</h4>
    <h1 class="text-white">€{{ creditPackage.price }}</h1>

    <div class="my-6 border-b border-bg-lighter"></div>

    <!-- Service -->
    <div class="match-services mb-12">
      <PaymentPricingService
        :name="$t('dashboard.credits.creditsAmount')"
        :value="creditPackage.creditAmount"
      />
      <PaymentPricingService
        :name="$t('dashboard.credits.bonus')"
        :value="`${creditPackage.bonusCredits}`"
      />
    </div>

    <Btn
      type="primary"
      size="large"
      :color="colors.blue"
      round
      :loading="loading"
      @click="getCreditSessionUrl(creditPackage.id)"
    >
      {{ $t('dashboard.credits.buy') }}
    </Btn>
  </div>
</template>

<script lang="ts" setup>
import colors from '~/tailwind.colors';

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
