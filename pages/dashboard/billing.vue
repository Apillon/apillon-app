<template>
  <Dashboard :loading="loading">
    <template #heading>
      <h4>{{ $t('dashboard.billing') }}</h4>
    </template>
    <slot>
      <div class="grid grid-cols-billing gap-5">
        <n-card :bordered="false" :title="t('dashboard.yourPlan')">
          <div class="flex items-center">
            <span class="icon-star text-xl text-primary mr-3"></span>
            <h4>{{ paymentStore.activeSubscription.stripeId }}</h4>
          </div>
          Edit plan:
          <a :href="config.public.stripePortal" class="text-yellow" target="_blank">
            Stripe portal
          </a>
        </n-card>
        <n-card :bordered="false" :title="t('dashboard.payment.expiresOn')">
          <h4>{{ datetimeToDate(paymentStore.activeSubscription.expiresOn) }}</h4>
        </n-card>
        <n-card :bordered="false" title="Credits">
          <h4>{{ paymentStore.credit.balance }}</h4>
        </n-card>
      </div>

      <!-- Credit packages -->
      <n-h5 prefix="bar">Credit packages</n-h5>
      <div v-if="paymentStore.hasCreditPackages" class="grid grid-cols-billing gap-5">
        <PaymentCreditPackage
          v-for="(creditPackage, key) in paymentStore.creditPackages"
          :key="key"
          :credit-package="creditPackage"
        />
      </div>

      <!-- Subscription packages -->
      <n-h5 prefix="bar">Subscription packages</n-h5>
      <n-scrollbar
        v-if="paymentStore.hasSubscriptionPackages"
        class="has-scrollbar-bottom"
        x-scrollable
      >
        <div class="flex gap-5">
          <PaymentCardPricing
            v-for="(subscriptionPackage, key) in paymentStore.subscriptionPackages"
            :key="key"
            :subscription-package="subscriptionPackage"
            :plan="pricingPlans[subscriptionPackage.name] || {}"
            :type="key % 2 === 0 ? 'dark' : 'light'"
            class="w-1/4 min-w-[18rem]"
          />
        </div>
      </n-scrollbar>

      <!-- Invoices -->
      <n-h5 prefix="bar">{{ $t('dashboard.invoice.invoices') }}</n-h5>
      <TablePaymentInvoices :invoices="paymentStore.invoices" />

      <!-- Credit Transactions -->
      <n-h5 prefix="bar">{{ $t('dashboard.credit.transactions') }}</n-h5>
      <TablePaymentCreditTransactions
        :credit-transactions="paymentStore.creditTransactions"
        class="pb-8"
      />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const { t } = useI18n();
const { query } = useRoute();
const message = useMessage();
const config = useRuntimeConfig();
const paymentStore = usePaymentsStore();

useHead({
  title: t('dashboard.billing'),
});

const loading = ref<boolean>(true);

const pricingPlans: Record<string, PricingPlan> = {
  Freemium: {
    name: 'Egg',
    price: 0,
    description: 'Tap into the world of Web3 and start light with your first project.',
    services: {
      storage: '3 GB Lifetime',
      bandwith: '20 GB Monthly',
      credits: '120 Credits Lifetime',
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
      credits: '500 Credits Lifetime',
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
      credits: '2000 Credits Lifetime',
    },
    otherServices: ['Smart Contract deploy', 'NFT minting', 'Identity (Kilt)', 'Compute (PHALA)'],
  },
  Butterfly: {
    name: 'Butterfly',
    price: null,
    description: 'Bring your enterprise to the Web3 level and go big on decentralized tech.',
    services: {
      storage: '∞ GB Lifetime',
      bandwith: '∞ GB Monthly',
      credits: '∞ Credits Lifetime',
    },
    otherServices: ['Smart Contract deploy', 'NFT minting', 'Identity (Kilt)', 'Compute (PHALA)'],
  },
};

onBeforeMount(() => {
  if (query.canceled) {
    message.warning(t('dashboard.payment.stripe.error'));
  } else if (query.success) {
    message.success(t('dashboard.payment.stripe.success'));
  }
});

onMounted(async () => {
  await paymentStore.getCreditPackages();
  await paymentStore.getSubscriptionPackages();
  await paymentStore.fetchCredit();
  await paymentStore.fetchCreditTransactions();
  await paymentStore.fetchSubscriptions();
  await paymentStore.fetchActiveSubscription();
  paymentStore.fetchInvoices();
  loading.value = false;
});
</script>
