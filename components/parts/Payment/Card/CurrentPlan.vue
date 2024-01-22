<template>
  <n-card
    v-if="showCard"
    class="card-dark"
    size="small"
    :bordered="false"
    :title="$t('dashboard.payment.currentPlan')"
  >
    <div class="h-full flex flex-col justify-between">
      <div class="flex gap-4 items-center mb-4">
        <span class="icon-billing text-xl"></span>
        <h3>
          <span class="block whitespace-nowrap">
            {{ paymentStore.getActiveSubscriptionPackage?.description }}&nbsp;
          </span>
          <span class="inline-block whitespace-nowrap">
            {{ formatPrice(paymentStore.getActiveSubscriptionPackage?.price || 0) }}/{{
              $t('general.month')
            }}
          </span>
        </h3>
      </div>
      <div class="mb-2 text-body">
        <span v-if="paymentStore.activeSubscription.cancelDate">
          {{
            $t('dashboard.subscription.canceledOn', {
              date: dateTimeToDate(paymentStore.activeSubscription.expiresOn),
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
      <div class="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4">
        <Btn
          :type="btnType"
          :disabled="authStore.isAdmin() || dataStore.isProjectUser"
          @click="modalSubscriptionPackagesVisible = true"
        >
          <template v-if="btnText">{{ btnText }}</template>
          <template v-else-if="paymentStore.hasActiveSubscription">
            {{ $t('dashboard.payment.comparePlans') }}
          </template>
          <template v-else>
            {{ $t('dashboard.payment.upgradePlan') }}
          </template>
        </Btn>
        <Btn
          v-if="paymentStore.hasActiveSubscription"
          type="primary"
          :color="colors.blue"
          :loading="loading"
          @click="goToCustomerPortal()"
        >
          {{ $t('dashboard.payment.managePlan') }}
        </Btn>
      </div>
    </div>
  </n-card>
  <Btn
    v-else
    :type="btnType"
    size="large"
    :disabled="dataStore.isProjectUser"
    @click="modalSubscriptionPackagesVisible = true"
  >
    <template v-if="btnText">{{ btnText }}</template>
    <template v-else>
      {{ $t('dashboard.payment.upgradePlan') }}
    </template>
  </Btn>

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
import colors from '~/tailwind.colors';

defineProps({
  showCard: { type: Boolean, default: true },
  btnType: { type: String as PropType<'primary' | 'secondary'>, default: 'primary' },
  btnText: { type: String, default: null },
});

const authStore = useAuthStore();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const { loading, goToCustomerPortal } = usePayment();

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

function upgradePlan() {}
</script>
