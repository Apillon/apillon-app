<template>
  <n-card
    class="card-dark"
    size="small"
    :bordered="false"
    :title="$t('dashboard.credits.currentCredits')"
  >
    <div class="h-full flex flex-col justify-between">
      <div class="flex gap-4 items-center mb-6">
        <span class="inline-block icon-credits text-blue text-xl align-text-top"></span>
        <h3>
          {{ formatNumber(paymentStore.credit.balance || 0) }}
          {{ $t('dashboard.credits.credits') }}
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
    </div>
  </n-card>

  <!-- Modal -->
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
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const modalCreditPackagesVisible = ref<boolean>(false);
</script>
