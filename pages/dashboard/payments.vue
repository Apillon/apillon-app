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
      <div class="grid sm:grid-cols-billing gap-8 mb-12 max-w-6xl">
        <PaymentCardCurrentCredits />
        <PaymentCardCurrentPlan />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const { creditsMessage, subscriptionMessage } = usePayment();

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

        creditsMessage();
        subscriptionMessage();
      });
    });
  }, 100);
});
</script>
