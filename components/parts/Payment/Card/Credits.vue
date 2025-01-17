<template>
  <n-card class="card-dark" :bordered="false" :title="$t('dashboard.credits.currentCredits')">
    <div class="flex h-full flex-col justify-between">
      <div class="mb-6 flex items-center gap-4">
        <span class="icon-credits inline-block align-text-top text-xl text-blue"></span>
        <h3>
          {{ formatNumber(paymentStore.credit.balance || 0) }}
          {{ $t('dashboard.credits.credits') }}
        </h3>
      </div>
      <Btn
        type="primary"
        size="large"
        :disabled="authStore.isAdmin() || dataStore.isProjectUser"
        @click="modalCreditPackagesVisible = true"
      >
        {{ $t('dashboard.credits.getMore') }}
      </Btn>
    </div>
  </n-card>

  <!-- Modal -->
  <modal v-model:show="modalCreditPackagesVisible" size="large">
    <div
      v-drag-scroll.options="{ direction: 'x' }"
      class="tablet:scrollable pb-1 tablet:overflow-x-auto lg:!cursor-default"
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
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const modalCreditPackagesVisible = ref<boolean>(false);
</script>
