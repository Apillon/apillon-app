<template>
  <n-card
    class="card-dark"
    size="small"
    :bordered="false"
    :title="$t('dashboard.payment.currentPlan')"
  >
    <div class="h-full flex flex-col justify-between">
      <div class="flex gap-4 items-center mb-4">
        <span class="icon-billing text-xl"></span>
        <h3>
          {{ paymentStore.getActiveSubscriptionPackage?.name }}
          {{ formatPrice(paymentStore.getActiveSubscriptionPackage?.price || 0, 'eur') }}/{{
            $t('general.month')
          }}
        </h3>
      </div>
      <div class="mb-2 text-body">
        <span v-if="paymentStore.activeSubscription.cancelDate">
          {{
            $t('dashboard.subscription.canceledOn', {
              date: dateTimeToDate(paymentStore.activeSubscription.cancelDate),
            })
          }}
        </span>
        <span v-else-if="paymentStore.activeSubscription.expiresOn">
          {{
            $t('dashboard.subscription.nextBilling', {
              date: dateTimeToDate(paymentStore.activeSubscription.expiresOn),
            })
          }}
        </span>
      </div>
      <Btn
        type="primary"
        size="large"
        :disabled="dataStore.isProjectUser"
        @click="modalSubscriptionPackagesVisible = true"
      >
        {{ $t('dashboard.payment.upgrade') }}
      </Btn>
    </div>
  </n-card>

  <!-- Modal -->
  <modal v-model:show="modalSubscriptionPackagesVisible" size="large">
    <div
      v-drag-scroll.options="{ direction: 'x' }"
      class="tablet:scrollable tablet:overflow-x-auto lg:!cursor-default pb-1"
    >
      <div class="flex gap-12">
        <PaymentSubscriptionPackage
          v-for="(subscriptionPackage, key) in paymentStore.subscriptionPackages"
          :key="key"
          :subscription-package="subscriptionPackage"
          :plan="pricingPlans[subscriptionPackage.name] || {}"
          class="min-w-[10rem] md:min-w-[16rem]"
        />
      </div>
    </div>
  </modal>
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const modalSubscriptionPackagesVisible = ref<boolean>(false);

const pricingPlans: Record<string, PricingPlan> = {
  Freemium: {
    name: 'Egg',
    price: 0,
    description: 'Tap into the world of Web3 and start light with your first project.',
    services: {
      storage: '3 GB Lifetime',
      bandwith: '20 GB Monthly',
      credits: '1200 Credits Lifetime',
    },
    otherServices: ['Smart Contract deploy', 'NFT minting', 'Identity (Kilt)', 'Compute (PHALA)'],
  },
  Caterpillar: {
    name: 'Caterpillar',
    price: 19.9,
    description: 'Expand your Web3 reach with advanced features and shared access.',
    services: {
      storage: '60 GB Lifetime',
      bandwith: '150 GB Monthly',
      credits: '5000 Credits Lifetime',
    },
    otherServices: ['Smart Contract deploy', 'NFT minting', 'Identity (Kilt)', 'Compute (PHALA)'],
  },
  Cocoon: {
    name: 'Cocoon',
    price: 79.9,
    description: 'Bring your enterprise to the Web3 level and go big on decentralized tech.',
    services: {
      storage: '300 GB Lifetime',
      bandwith: '750 GB Monthly',
      credits: '20000 Credits Lifetime',
    },
    otherServices: ['Smart Contract deploy', 'NFT minting', 'Identity (Kilt)', 'Compute (PHALA)'],
  },
};
</script>
