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

      <!-- Payment methods -->
      <n-h5 prefix="bar">{{ $t('dashboard.payment.title') }}</n-h5>
      <TablePaymentMethods class="mb-4" @changePaymentEmit="showDrawerPaymentMethod" />

      <n-card>
        <div class="flex md:flex-row flex-col md:justify-between">
          <div>
            <h5 class="text-lg mb-2">{{ $t('dashboard.addPaymentMethod') }}</h5>
            <p class="text-sm">{{ $t('dashboard.addPaymentMethodText') }}</p>
          </div>
          <div>
            <Btn type="primary" @click="showDrawerPaymentMethod">
              {{ $t('dashboard.addPayment') }}
            </Btn>
          </div>
        </div>
      </n-card>

      <!-- Drawer - Add new payment method -->
      <n-drawer v-model:show="drawerPaymentMethodActive" :width="495">
        <n-drawer-content>
          <template #header>
            <h5>{{ $t('dashboard.addPayment') }}</h5>
          </template>
          <FormPaymentMethod />
        </n-drawer-content>
      </n-drawer>

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
const paymentStore = usePaymentsStore();

useHead({
  title: t('dashboard.billing'),
});

const loading = ref<boolean>(true);

/**
 * Drawer - add payment
 */
const drawerPaymentMethodActive = ref(false);
const showDrawerPaymentMethod = () => {
  drawerPaymentMethodActive.value = true;
};

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
  Butterfly: {
    name: 'Butterfly',
    price: 79.9,
    description: 'Bring your enterprise to the Web3 level and go big on decentralized tech.',
    services: {
      storage: '300 GB Lifetime',
      bandwith: '750 GB Monthly',
      credits: '2000 Credits Lifetime',
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
  paymentStore.fetchCredit();
  paymentStore.fetchCreditTransactions();
  paymentStore.fetchSubscriptions();
  paymentStore.fetchActiveSubscription();
  paymentStore.fetchInvoices();
  loading.value = false;
});
</script>
