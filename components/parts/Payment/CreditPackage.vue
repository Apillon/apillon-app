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
      <ul class="mb-4 inline-flex list-disc flex-col pl-4 text-left">
        <li v-for="(item, key) in translateItems('dashboard.credits.includedServices')" :key="key">
          {{ item }}
        </li>
      </ul>
    </div>

    <n-tooltip v-if="!dataStore.isUserOwner" :trigger="isMd ? 'hover' : 'click'">
      <template #trigger>
        <Btn class="cursor-default opacity-60" type="primary" size="large" :color="colors.blue" round>
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
        {{ $t('dashboard.credits.buyWithCreditCard') }}
      </Btn>

      <n-tooltip v-if="creditPackage.creditAmount === 10000" :trigger="isMd ? 'hover' : 'click'">
        <template #trigger>
          <Btn class="cursor-default opacity-60" type="primary" size="large" round>
            {{ $t('dashboard.credits.buyWithDot') }}
          </Btn>
        </template>
        <span>{{ $t('dashboard.credits.disabled') }}</span>
      </n-tooltip>
      <Btn
        v-else
        type="primary"
        size="large"
        round
        :loading="loadingCrypto"
        @click="getCryptoSessionUrl(creditPackage.id)"
      >
        {{ $t('dashboard.credits.buyWithDot') }}
      </Btn>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { colors } from '~/tailwind.config';
import { translateItems } from '~/lib/utils';
import { formatPrice, formatNumber } from '~/lib/utils/helpers';

defineProps({
  creditPackage: { type: Object as PropType<CreditPackageInterface>, required: true },
});

const { isMd } = useScreen();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();

const loading = ref<boolean>(false);
const loadingCrypto = ref<boolean>(false);

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
