<template>
  <Dashboard :loading="loading">
    <template #heading>
      <Heading>
        <slot>
          <h2>{{ $t('dashboard.billing') }}</h2>
        </slot>

        <template #submenu>
          <MenuBilling />
        </template>
      </Heading>
    </template>
    <slot>
      <div class="mb-12 grid max-w-6xl gap-8 sm:grid-cols-billing">
        <PaymentCardCredits />
        <PaymentCardPlan />
      </div>

      <!-- Usage -->
      <div class="mt-6 pb-8">
        <h3 class="mb-6">{{ $t('dashboard.usage.title') }}</h3>
        <div class="flex gap-2 border-b border-bg-lighter p-3">
          <span class="icon-storage text-xl"></span>
          <h5>
            {{ $t('dashboard.usage.storage') }} -
            {{ paymentStore.getActiveSubscriptionPackage?.name }}
          </h5>
        </div>
        <div class="items-center gap-3 border-b border-bg-lighter p-3 text-body sm:flex">
          <div class="min-w-[12rem]">
            {{ $t('dashboard.usage.bytesStored') }}
          </div>
          <div class="w-full">
            <PaymentProgress :size="storageStore.info.usedStorage" :total-size="storageStore.info.availableStorage" />
          </div>
        </div>
        <div class="items-center gap-3 border-b border-bg-lighter p-3 text-body sm:flex">
          <div class="min-w-[12rem]">
            {{ $t('dashboard.usage.bandwith') }}
          </div>
          <div class="w-full">
            <PaymentProgress
              :size="storageStore.info.usedBandwidth"
              :total-size="storageStore.info.availableBandwidth"
              :label-total="'/' + $t('general.month')"
            />
          </div>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const { creditsMessage, subscriptionMessage } = usePayment();

useHead({
  title: t('dashboard.billing'),
});

const loading = ref<boolean>(true);

onMounted(async () => {
  await dataStore.waitOnPromises();

  await Promise.all([
    paymentStore.getActiveSubscription(),
    paymentStore.getSubscriptionPackages(),
    paymentStore.getCreditPackages(),
    storageStore.getStorageInfo(),
  ]);

  loading.value = false;
  creditsMessage();
  subscriptionMessage();
});
</script>
