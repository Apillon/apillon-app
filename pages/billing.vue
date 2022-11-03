<template>
  <Dashboard>
    <template #heading>
      <h4 class="-mb-4">{{ $t('dashboard.billing') }}</h4>
    </template>
    <slot>
      <div class="grid grid-cols-billing gap-5">
        <n-card :bordered="false" :title="t('dashboard.yourPlan')">
          <div class="flex items-center">
            <span class="icon-star text-xl text-primary mr-3"></span>
            <h4>Professional plan</h4>
          </div>
        </n-card>
        <n-card :bordered="false" :title="t('dashboard.invoiceDate')">
          <h4>20 Jul 2022</h4>
        </n-card>
        <n-card :bordered="false" :title="t('dashboard.invoiceTotal')">
          <h4>$30</h4>
        </n-card>
      </div>

      <!-- Payment methods -->
      <n-h5 prefix="bar">{{ $t('dashboard.payment') }}</n-h5>
      <n-card>
        <div class="flex md:flex-row flex-col md:justify-between">
          <div>
            <h5 class="text-lg mb-2">{{ $t('dashboard.addPaymentMethod') }}</h5>
            <p class="text-sm">{{ $t('dashboard.addPaymentMethodText') }}</p>
          </div>
          <div>
            <Btn type="primary" @click="activate">
              {{ $t('dashboard.addPayment') }}
            </Btn>
          </div>
        </div>
      </n-card>
      <n-drawer v-model:show="active" :width="495">
        <n-drawer-content>
          <template #header>
            <h5>{{ $t('dashboard.addPayment') }}</h5>
          </template>
          <FormPaymentMethod />
        </n-drawer-content>
      </n-drawer>

      <!-- Invoices -->
      <n-h5 prefix="bar">{{ $t('dashboard.invoices') }}</n-h5>
      <TableInvoices />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  title: t('dashboard.billing'),
});

/**
 * Drawer - add payment
 */
const active = ref(false);
const activate = () => {
  active.value = true;
};
</script>
