<template>
  <div class="credits-package text-center text-body">
    <h4 class="mb-6">{{ creditPackage.name }} {{ $t('dashboard.credits.credits') }}</h4>
    <h1 class="text-white">{{ formatPrice(creditPackage.price) }}</h1>

    <div class="my-6 border-b border-bg-lighter"></div>

    <!-- Package -->
    <div class="match-services mb-12">
      <PaymentPricingService
        :name="$t('dashboard.credits.creditsAmount')"
        :value="formatNumber(creditPackage.creditAmount)"
      />
      <PaymentPricingService
        :name="$t('dashboard.credits.bonus')"
        :value="`${formatNumber(creditPackage.bonusCredits)}`"
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

    <n-tooltip v-if="!dataStore.isUserOwner" trigger="hover">
      <template #trigger>
        <Btn
          class="opacity-60 cursor-default"
          type="primary"
          size="large"
          :color="colors.blue"
          round
        >
          {{ $t('dashboard.credits.buy') }}
        </Btn>
      </template>
      <span>{{ $t('dashboard.permissions.notOwner') }}</span>
    </n-tooltip>
    <n-space v-else size="large" vertical>
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
      <Btn
        type="primary"
        size="large"
        round
        :loading="loadingCrypto"
        @click="getCryptoSessionUrl(creditPackage.id)"
      >
        {{ $t('dashboard.credits.buyWithCrypto') }}
      </Btn>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import colors from '~/tailwind.colors';

defineProps({
  creditPackage: { type: Object as PropType<CreditPackageInterface>, required: true },
});

const loading = ref<boolean>(false);
const loadingCrypto = ref<boolean>(false);
const dataStore = useDataStore();
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

async function getCryptoSessionUrl(packageId: number) {
  loadingCrypto.value = true;
  const cryptoSessionUrl = await paymentStore.fetchCryptoSessionUrl(packageId);
  loadingCrypto.value = false;

  if (cryptoSessionUrl?.invoice_url) {
    /** Remove key from SS */
    sessionStorage.removeItem(SessionKeys.CREDITS_MSG);

    window.open(cryptoSessionUrl.invoice_url, '_self');
  }
}
</script>
