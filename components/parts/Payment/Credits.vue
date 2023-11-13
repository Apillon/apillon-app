<template>
  <div v-if="dataStore.hasProjects" class="relative min-w-[8rem]">
    <div :class="{ 'opacity-0': paymentStore.loading }">
      <component
        :is="dataStore.isUserOwner ? NuxtLink : 'span'"
        :to="dataStore.isUserOwner ? { name: 'dashboard-payments' } : undefined"
      >
        <span class="inline-block icon-credits text-blue text-xl align-text-top"></span>
        <strong class="inline-block text-blue ml-2 mr-1">
          {{ formatCredits(paymentStore.credit.balance || 0) }}
        </strong>
        <span class="text-bodyDark">{{ $t('dashboard.credits.available') }}</span>
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
