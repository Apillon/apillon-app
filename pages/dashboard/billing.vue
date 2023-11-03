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
            <h3>
              {{ formatNumber(paymentStore.credit.balance) }} {{ $t('dashboard.credits.credits') }}
            </h3>
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
              {{ paymentStore.getActiveSubscriptionPackage?.name }}
              {{ formatPrice(paymentStore.getActiveSubscriptionPackage?.price || 0, 'eur') }}/{{
                $t('general.month')
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
      <modal v-model:show="modalCreditPackagesVisible" size="large">
        <div
          v-drag-scroll.options="{ direction: 'x' }"
          class="tablet:scrollable tablet:overflow-x-auto lg:!cursor-default pb-1"
        >
          <div class="flex gap-12">
            <PaymentCreditPackage
              v-for="(creditPackage, key) in paymentStore.creditPackages"
              :key="key"
              :credit-package="creditPackage"
              class="min-w-[10rem] md:min-w-[16rem]"
            />
          </div>
        </div>
      </modal>
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
          paymentStore.getInvoices().then(() => resolve());
        })
      );
      promises.push(
        new Promise<void>(resolve => {
          paymentStore.fetchCreditTransactions().then(() => resolve());
        })
      );
      promises.push(
        new Promise<void>(resolve => {
          paymentStore.getActiveSubscription().then(() => resolve());
        })
      );
      promises.push(
        new Promise<void>(resolve => {
          paymentStore.getSubscriptionPackages().then(() => resolve());
        })
      );
      promises.push(
        new Promise<void>(resolve => {
          paymentStore.getCreditPackages().then(() => resolve());
        })
      );

      await Promise.all(promises).then(async _ => {
        loading.value = false;

        if (query.subscription && paymentStore.activeSubscription.package_id) {
          message.success(
            t('dashboard.payment.stripe.subscription', {
              plan: paymentStore.getActiveSubscriptionPackage?.name,
            })
          );
        } else if (query.credits && (await wereCreditsPurchased())) {
          const creditPackage = paymentStore.creditPackages.find(
            item => item.id === parseInt(toStr(query.credits))
          );

          if (creditPackage) {
            message.success(
              t('dashboard.payment.stripe.credits', {
                credits: formatNumber(creditPackage.creditAmount + creditPackage.bonusCredits),
              })
            );
          }
        }
      });
    });
  }, 100);
});

async function wereCreditsPurchased() {
  const lastInvoice = await paymentStore.fetchInvoices(1, 1);
  return (
    lastInvoice?.data?.total &&
    lastInvoice?.data?.items &&
    lastInvoice.data.items[0].referenceTable === 'creditPackage' &&
    isInLastMinute(lastInvoice.data.items[0].createTime)
  );
}

function isInLastMinute(createTime: string | null) {
  return !!createTime && new Date(createTime).getTime() + MINUTE_IN_MS > Date.now();
}
</script>
