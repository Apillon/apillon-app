<template>
  <Dashboard :loading="loading">
    <template #heading>
      <Heading :headline="$t('dashboard.billing')">
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
  await Promise.all([paymentStore.getInvoices(), paymentStore.fetchCreditTransactions()]);
  loading.value = false;
});
</script>
