<template>
  <div v-if="plan.name" class="subscription-package text-center text-body">
    <h4 class="mb-6">{{ subscriptionPackage.name || plan.name }}</h4>

    <!-- Price -->
    <template v-if="plan.price === 0">
      <h1 class="text-white">{{ $t('dashboard.subscription.free') }}</h1>
      <p class="mb-6 mt-0">{{ $t('dashboard.subscription.forever') }}</p>
    </template>
    <template v-else>
      <h1 class="text-white">€{{ plan.price }}</h1>
      <p class="mb-6 mt-0">{{ $t('dashboard.subscription.perMonth') }}</p>
    </template>

    <div class="my-6 border-b border-bg-lighter"></div>

    <!-- Service -->
    <div v-if="plan.services" class="match-services mb-12">
      <h4>{{ $t('dashboard.subscription.web3Services') }}</h4>
      <PaymentPricingService
        :name="$t('dashboard.subscription.storage')"
        :value="plan.services.storage"
      />
      <PaymentPricingService
        :name="$t('dashboard.subscription.bandwidth')"
        :value="plan.services.bandwith"
      />
      <PaymentPricingService
        :name="$t('dashboard.subscription.otherServices')"
        :value="plan.services.credits"
      />
    </div>

    <Btn
      v-if="paymentsStore.activeSubscription?.package_id === subscriptionPackage.id"
      type="primary"
      size="large"
      round
      disabled
    >
      {{ $t('dashboard.payment.currentPlan') }}
    </Btn>
    <Btn
      v-else
      type="primary"
      size="large"
      :color="colors.blue"
      round
      :loading="loading"
      @click="getSubscriptionSessionUrl(subscriptionPackage.id)"
    >
      {{ $t('dashboard.payment.selectPlan') }}
    </Btn>
  </div>
</template>

<script lang="ts" setup>
import colors from '~/tailwind.colors';

defineProps({
  subscriptionPackage: {
    type: Object as PropType<SubscriptionPackageInterface>,
    required: true,
  },
  plan: { type: Object as PropType<PricingPlan>, default: {} as PricingPlan },
});

const loading = ref<boolean>(false);
const paymentsStore = usePaymentsStore();

async function getSubscriptionSessionUrl(packageId: number) {
  if (paymentsStore.activeSubscription?.id) {
    return await goToCustomerPortal();
  }
  loading.value = true;
  const stripeSessionUrl = await paymentsStore.fetchSubscriptionSessionUrl(packageId);
  loading.value = false;

  if (stripeSessionUrl) {
    window.open(stripeSessionUrl, '_self');
  }
}

async function goToCustomerPortal() {
  loading.value = true;
  const customerPortalUrl = await paymentsStore.getCustomerPortalURL();
  loading.value = false;

  if (customerPortalUrl) {
    window.open(customerPortalUrl, '_blank');
  }
}
</script>
