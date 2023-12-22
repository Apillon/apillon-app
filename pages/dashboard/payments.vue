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

      <!-- Usage -->
      <div class="mt-6 pb-8">
        <h3 class="mb-6">{{ $t('dashboard.usage.title') }}</h3>
        <div class="p-3 border-b border-bg-lighter flex gap-2">
          <span class="icon-storage text-xl"></span>
          <h5>
            {{ $t('dashboard.usage.storage') }} -
            {{ paymentStore.getActiveSubscriptionPackage?.name }}
          </h5>
        </div>
        <div class="p-3 border-b border-bg-lighter sm:flex items-center gap-3 text-body">
          <div class="min-w-[12rem]">
            {{ $t('dashboard.usage.bytesStored') }}
          </div>
          <div class="w-full">
            <PaymentProgress
              :size="storageStore.info.usedStorage"
              :total-size="storageStore.info.availableStorage"
            />
          </div>
        </div>
        <div class="p-3 border-b border-bg-lighter sm:flex items-center gap-3 text-body">
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
      promises.push(
        new Promise<void>(resolve => {
          storageStore.getStorageInfo().then(() => resolve());
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
