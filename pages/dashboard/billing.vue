<template>
  <Dashboard :loading="loading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.billing') }}</h1>
        </slot>

        <template #submenu>
          <MenuBilling />
        </template>
      </Heading>
    </template>
    <slot>
      <div class="grid sm:grid-cols-2 gap-8 mb-12">
        <n-card
          class="card-dark"
          size="small"
          :bordered="false"
          :title="$t('dashboard.credits.currentCredits')"
        >
          <div class="flex gap-4 items-center mb-6">
            <span class="inline-block icon-credits text-blue text-xl align-text-top"></span>
            <h3>{{ paymentStore.credit.balance }} {{ $t('dashboard.credits.credits') }}</h3>
          </div>
          <Btn
            type="secondary"
            size="large"
            :disabled="dataStore.isProjectUser"
            @click="modalCreditPackagesVisible = true"
          >
            {{ $t('dashboard.credits.getMore') }}
          </Btn>
        </n-card>
        <n-card
          class="card-dark"
          size="small"
          :bordered="false"
          :title="$t('dashboard.payment.currentPlan')"
        >
          <div class="flex gap-4 items-center mb-6">
            <span class="icon-billing text-xl"></span>
            <h3>
              {{
                $t('dashboard.payment.costsPerMonth', {
                  costs: paymentStore.getActiveSubscriptionPackage?.price || 0,
                })
              }}
            </h3>
          </div>
          <Btn
            type="primary"
            size="large"
            :disabled="dataStore.isProjectUser"
            @click="modalSubscriptionPackagesVisible = true"
          >
            {{ $t('dashboard.payment.upgrade') }}
          </Btn>
        </n-card>
      </div>

      <!-- Invoices -->
      <h4 class="mt-12 mb-6">{{ $t('dashboard.invoice.invoices') }}</h4>
      <TablePaymentInvoices />

      <!-- Credit Transactions -->
      <h4 class="mt-12 mb-6">{{ $t('dashboard.credits.transactions') }}</h4>
      <TablePaymentCreditTransactions class="pb-8" />

      <!-- Modals -->
      <modal v-model:show="modalCreditPackagesVisible">
        <div class="grid grid-cols-3 gap-12">
          <PaymentCreditPackage
            v-for="(creditPackage, key) in paymentStore.creditPackages"
            :key="key"
            :credit-package="creditPackage"
          />
        </div>
      </modal>
      <modal v-model:show="modalSubscriptionPackagesVisible" size="large">
        <div v-drag-scroll.options="{ direction: 'x' }" class="scrollable overflow-x-auto pb-1">
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
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { query } = useRoute();
const message = useMessage();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();

useHead({
  title: t('dashboard.billing'),
});

const loading = ref<boolean>(true);
const modalCreditPackagesVisible = ref<boolean>(false);
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

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const promises: Promise<any>[] = [];

      promises.push(
        new Promise<void>(resolve => {
          paymentStore.fetchInvoices().then(() => resolve());
        })
      );
      promises.push(
        new Promise<void>(resolve => {
          paymentStore.fetchCreditTransactions().then(() => resolve());
        })
      );

      await Promise.all(promises).then(_ => {
        paymentStore.getCreditPackages();
        paymentStore.getSubscriptionPackages();
        paymentStore.getActiveSubscription();

        loading.value = false;
        if (query.success && paymentStore.activeSubscription.package_id) {
          message.success(
            t('dashboard.payment.stripe.success', {
              plan: paymentStore.getActiveSubscriptionPackage.name,
            })
          );
        }
      });
    });
  }, 100);
});
</script>
