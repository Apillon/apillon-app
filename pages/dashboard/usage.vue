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
      <div class="mb-6 max-w-lg">
        <h4 class="mb-6">{{ $t('dashboard.usage.title') }}</h4>
        <p class="text-body">{{ $t('dashboard.usage.description') }}</p>
      </div>

      <!-- Storage -->
      <div class="mt-6">
        <div class="p-3 border-b border-bg-lighter flex gap-2">
          <span class="icon-storage text-xl"></span>
          <h5>{{ $t('dashboard.usage.storage') }}</h5>
        </div>
        <div class="p-3 border-b border-bg-lighter flex items-center gap-3 text-body">
          <div class="min-w-[12rem]">
            {{ $t('dashboard.usage.bytesStored') }}
          </div>
          <div class="w-full">
            <PaymentProgress :size="2500000" :total-size="50000000" />
          </div>
        </div>
        <div class="p-3 border-b border-bg-lighter flex items-center gap-3 text-body">
          <div class="min-w-[12rem]">
            {{ $t('dashboard.usage.bandwith') }}
          </div>
          <div class="w-full">
            <PaymentProgress :size="2500000" :total-size="5000000" label-total="/day" />
          </div>
        </div>
      </div>

      <!-- Hosting -->
      <div class="mt-6">
        <div class="p-3 border-b border-bg-lighter flex gap-2">
          <span class="icon-hosting text-xl"></span>
          <h5>{{ $t('dashboard.usage.hosting') }}</h5>
        </div>
        <div class="p-3 border-b border-bg-lighter flex items-center gap-3 text-body">
          <div class="min-w-[12rem]">
            {{ $t('dashboard.usage.downloads') }}
          </div>
          <div class="w-full">
            <PaymentProgress :size="2500000" :total-size="5000000" />
          </div>
        </div>
        <div class="p-3 border-b border-bg-lighter flex items-center gap-3 text-body">
          <div class="min-w-[12rem]">
            {{ $t('service.storage.name') }}
          </div>
          <div class="w-full">
            <PaymentProgress :size="2500000" :total-size="5000000" />
          </div>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const paymentsStore = usePaymentsStore();

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
          paymentsStore.getSubscriptionPackages().then(() => resolve());
        })
      );
      promises.push(
        new Promise<void>(resolve => {
          paymentsStore.getCreditPackages().then(() => resolve());
        })
      );

      await Promise.all(promises).then(_ => {
        loading.value = false;
      });
    });
  }, 100);
});
</script>
