<template>
  <div v-if="dataStore.hasProjects" class="relative xl:min-w-[8rem]">
    <div :class="{ 'opacity-0': paymentStore.loading }">
      <component
        :is="!dataStore.isProjectUser ? NuxtLink : 'span'"
        :to="!dataStore.isProjectUser ? { name: 'dashboard-payments' } : undefined"
      >
        <span class="inline-block whitespace-nowrap text-blue">
          <span class="icon-credits inline-block align-text-top text-xl"></span>
          <strong class="ml-2 mr-1 inline-block">
            {{ formatNumber(paymentStore.credit.balance || 0) }}
          </strong>
        </span>
        <span class="hidden text-bodyDark sm:inline-block">
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
