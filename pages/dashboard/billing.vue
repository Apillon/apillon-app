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
      <!-- Invoices -->
      <h4 class="mb-6">{{ $t('dashboard.credits.threshold') }}</h4>
      <FormCreditThreshold />

      <!-- Invoices -->
      <h4 class="mb-6 mt-4">{{ $t('dashboard.invoice.invoices') }}</h4>
      <TablePaymentInvoices />

      <!-- Credit Transactions -->
      <h4 class="mb-6 mt-12">{{ $t('dashboard.credits.transactions') }}</h4>
      <TablePaymentCreditTransactions class="pb-8" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();

useHead({
  title: t('dashboard.billing'),
});

const loading = ref<boolean>(true);

onMounted(async () => {
  await dataStore.waitOnPromises();
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

  await Promise.all(promises);
  loading.value = false;
});
</script>
