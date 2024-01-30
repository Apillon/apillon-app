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
      <div v-if="$t('dashboard.usage.description')" class="mb-6 max-w-lg">
        <h4 class="mb-6">{{ $t('dashboard.usage.title') }}</h4>
        <p>{{ $t('dashboard.usage.description') }}</p>
      </div>

      <!-- Storage -->
      <div class="mt-6">
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

      <!-- Hosting 
      <div class="mt-6">
        <div class="p-3 border-b border-bg-lighter flex gap-2">
          <span class="icon-hosting text-xl"></span>
          <h5>{{ $t('dashboard.usage.hosting') }}</h5>
        </div>
        <div class="p-3 border-b border-bg-lighter sm:flex items-center gap-3 text-body">
          <div class="min-w-[12rem]">
            {{ $t('dashboard.usage.downloads') }}
          </div>
          <div class="w-full">
            <PaymentProgress
              :size="storageStore.info.usedBandwidth"
              :total-size="storageStore.info.availableBandwidth"
              label-total="/day"
            />
          </div>
        </div>
        <div class="p-3 border-b border-bg-lighter sm:flex items-center gap-3 text-body">
          <div class="min-w-[12rem]">
            {{ $t('dashboard.service.storage.name') }}
          </div>
          <div class="w-full">
            <PaymentProgress
              :size="storageStore.info.usedStorage"
              :total-size="storageStore.info.availableStorage"
            />
          </div>
        </div>
      </div>
      -->

      <div v-if="showUpgrade" class="grid sm:grid-cols-2 gap-8 my-12">
        <div>
          <h4 class="mb-6">{{ $t('dashboard.usage.upgrade') }}</h4>
          <PaymentCardCurrentPlan />
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

onMounted(() => {});
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
          storageStore.getStorageInfo().then(() => resolve());
        })
      );
      promises.push(
        new Promise<void>(resolve => {
          paymentStore.getSubscriptionPackages().then(() => resolve());
        })
      );
      promises.push(
        new Promise<void>(resolve => {
          paymentStore.getActiveSubscription().then(() => resolve());
        })
      );

      await Promise.all(promises).then(_ => {
        loading.value = false;
      });
    });
  }, 100);
});

const showUpgrade = computed(() => {
  return (
    storagePercentage(storageStore.info.usedStorage, storageStore.info.availableStorage) > 50 ||
    storagePercentage(storageStore.info.usedBandwidth, storageStore.info.availableBandwidth) > 50 ||
    !paymentStore.activeSubscription.package_id
  );
});
</script>
