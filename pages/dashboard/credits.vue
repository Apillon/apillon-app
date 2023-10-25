<template>
  <Dashboard :loading="loading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.credits.title') }}</h1>
        </slot>

        <template #submenu>
          <MenuBilling />
        </template>
      </Heading>
    </template>
    <slot>
      <!-- Credit packages -->
      <n-h5 prefix="bar">{{ $t('dashboard.credits.packages') }}</n-h5>
      <div v-if="paymentsStore.hasCreditPackages" class="grid grid-cols-3 gap-5">
        <PaymentCreditPackage
          v-for="(creditPackage, key) in paymentsStore.creditPackages"
          :key="key"
          :credit-package="creditPackage"
        />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const paymentsStore = usePaymentsStore();
const loading = ref<boolean>(true);

useHead({
  title: t('dashboard.credits.title'),
});

onMounted(async () => {
  await paymentsStore.getCreditPackages();
  paymentsStore.fetchCreditTransactions();
  loading.value = false;
});
</script>
