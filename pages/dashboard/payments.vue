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
        <PaymentCardCurrentCredits />
        <PaymentCardCurrentPlan />
      </div>
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

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const promises: Promise<any>[] = [];

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
        } else if (
          query.credits &&
          isCacheExpired(SessionKeys.CREDITS_MSG) &&
          (await wereCreditsPurchased())
        ) {
          const creditPackage = paymentStore.creditPackages.find(
            item => item.id === parseInt(toStr(query.credits))
          );

          if (creditPackage) {
            /** Save timestamp to SS */
            sessionStorage.setItem(SessionKeys.CREDITS_MSG, Date.now().toString());

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
