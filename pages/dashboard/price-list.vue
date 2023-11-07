<template>
  <Dashboard :loading="loading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.pageMenu.priceList') }}</h1>
        </slot>

        <template #submenu>
          <MenuBilling />
        </template>
      </Heading>
    </template>
    <slot>
      <PaymentCreditCosts class="pb-8" filter-by-chain filter-by-service />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const paymentStore = usePaymentStore();
const loading = ref<boolean>(true);

useHead({
  title: t('dashboard.pageMenu.priceList'),
});

onMounted(async () => {
  await paymentStore.getPriceList();
  loading.value = false;
});
</script>
