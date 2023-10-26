<template>
  <div v-if="paymentStore.credit.balance">
    <NuxtLink :to="{ name: 'dashboard-billing' }">
      <span class="inline-block icon-credits text-blue text-xl align-text-top"></span>
      <strong class="inline-block text-blue ml-2 mr-1">{{ paymentStore.credit.balance }}</strong>
      <span class="text-bodyDark">{{ $t('dashboard.credits.available') }}</span>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
const paymentStore = usePaymentsStore();

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await paymentStore.getCredits();
    });
  }, 500);
});
</script>
