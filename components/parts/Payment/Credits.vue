<template>
  <div v-if="dataStore.hasProjects" class="relative sm:min-w-[8rem]">
    <div :class="{ 'opacity-0': paymentStore.loading }">
      <component
        :is="!dataStore.isProjectUser ? NuxtLink : 'span'"
        :to="!dataStore.isProjectUser ? { name: 'dashboard-payments' } : undefined"
      >
        <span class="inline-block icon-credits text-blue text-xl align-text-top"></span>
        <strong class="inline-block text-blue ml-2 mr-1">
          {{ formatNumber(paymentStore.credit.balance || 0) }}
        </strong>
        <span class="text-bodyDark hidden sm:inline-block">
          {{ $t('dashboard.credits.available') }}
        </span>
      </component>
    </div>
    <Spinner v-if="paymentStore.loading" :size="28" />
  </div>
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const NuxtLink = resolveComponent('NuxtLink');

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await paymentStore.getCredits();
    });
  }, 500);
});
</script>
