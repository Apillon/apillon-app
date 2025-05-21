<template>
  <Dashboard :loading="loading">
    <template #heading>
      <Heading :headline="$t('dashboard.pageMenu.priceList')">
        <template #submenu>
          <MenuBilling />
        </template>
      </Heading>
    </template>
    <slot>
      <div class="flex flex-col gap-6 pb-8">
        <PaymentCreditCosts
          v-for="(service, key) in enumValues(ServiceTypeName)"
          :key="key"
          :service="service.toString()"
        />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/lib/types/service';

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
