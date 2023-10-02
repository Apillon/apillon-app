<template>
  <div
    class="rounded-2xl border border-primary-bright p-6 md:p-8 lg:p-12"
    :class="type === 'dark' ? 'bg-bg-dark' : 'bg-bg-lighter'"
  >
    <h4 class="mb-6">{{ subscriptionPackage.name || plan.name }}</h4>

    <!-- Price -->
    <template v-if="plan.price === 0">
      <h1 :class="textTitleClass">Free</h1>
      <p class="mb-6 mt-0">forever</p>
    </template>
    <template v-else>
      <h1 :class="textTitleClass">€{{ plan.price }}</h1>
      <p class="mb-6 mt-0">per month</p>
    </template>

    <p class="match-description mb-8">
      {{ subscriptionPackage.description || plan.description }}
    </p>

    <Btn type="primary" class="w-full" @click="getSubscriptionSessionUrl(subscriptionPackage.id)">
      Select package
    </Btn>
    <p class="body-sm mt-1 h-5 italic">
      <template v-if="plan.price === 0">
        <span class="text-pink">*</span>
        No credit card needed.
      </template>
    </p>
    <div class="mb-12 mt-5 border-b border-primary-bright"></div>

    <!-- Service -->
    <div v-if="plan.services" class="match-services">
      <h4>Web3 services</h4>
      <PaymentPricingService name="Web3 Identity" :value="plan.services.identity" />
      <PaymentPricingService name="Web3 Storage" :value="plan.services.storage" />
      <PaymentPricingService name="Bandwith" :value="plan.services.bandwith" />
      <PaymentPricingService name="Web3 Hosting" :value="plan.services.hosting" />
      <PaymentPricingService name="Smart Contracts" :value="plan.services.smartContracts" />
      <PaymentPricingService
        name="Free Credits for other services"
        :value="plan.services.credits"
      />
    </div>

    <!-- Included -->
    <div class="my-12 border-b border-primary-bright"></div>
    <div class="">
      <h4>What other services?</h4>
      <ul class="mt-4 list-disc pl-5">
        <li v-for="(service, key) in plan.otherServices" :key="key">{{ service }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  subscriptionPackage: {
    type: Object as VuePropType<SubscriptionPackageInterface>,
    required: true,
  },
  plan: { type: Object as PropType<PricingPlan>, default: {} as PricingPlan },
  type: { type: String as PropType<'dark' | 'light'>, default: 'dark' },
});

const paymentStore = usePaymentsStore();

async function getSubscriptionSessionUrl(packageId: number) {
  const sessionUrl = await paymentStore.getSubscriptionSessionUrl(packageId);
  console.log(sessionUrl);
}
</script>
