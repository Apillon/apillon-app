<template>
  <div class="credits-package text-center text-body">
    <h4 class="mb-6">{{ creditPackage.name }} {{ $t('dashboard.credits.credits') }}</h4>
    <h1 class="text-white">{{ formatPrice(creditPackage.price, 'eur') }}</h1>

    <div class="my-6 border-b border-bg-lighter"></div>

    <!-- Package -->
    <div class="match-services mb-12">
      <PaymentPricingService
        :name="$t('dashboard.credits.creditsAmount')"
        :value="formatCredits(creditPackage.creditAmount)"
      />
      <PaymentPricingService
        :name="$t('dashboard.credits.bonus')"
        :value="`${formatCredits(creditPackage.bonusCredits)}`"
      />
    </div>

    <div class="my-6 border-b border-bg-lighter"></div>

    <!-- Included Service -->
    <div class="match-services mb-12">
      <p class="font-bold text-white">{{ $t('dashboard.credits.included') }}</p>
      <ul class="inline-flex flex-col list-disc pl-4 mb-4 text-left">
        <li v-for="(item, key) in translateItems('dashboard.credits.includedServices')" :key="key">
          {{ item }}
        </li>
      </ul>
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

const { t, te } = useI18n();
defineProps({
  creditPackage: { type: Object as PropType<CreditPackageInterface>, required: true },
});

const loading = ref<boolean>(false);
const paymentStore = usePaymentStore();

async function getCreditSessionUrl(packageId: number) {
  loading.value = true;
  const stripeSessionUrl = await paymentStore.fetchCreditSessionUrl(packageId);
  loading.value = false;

  if (stripeSessionUrl) {
    /** Remove key from SS */
    sessionStorage.removeItem(SessionKeys.CREDITS_MSG);

    window.open(stripeSessionUrl, '_self');
  }
}

function translateItems(key: string): String[] {
  return Array.from(Array(10).keys()).reduce((accumulator: String[], i) => {
    if (te(`${key}.${i}`) && t(`${key}.${i}`)) {
      accumulator.push(t(`${key}.${i}`));
    }
    return accumulator;
  }, [] as String[]);
}
</script>
