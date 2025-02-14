<template>
  <div v-if="dataStore.hasProjects" class="relative whitespace-nowrap">
    <div :class="{ 'opacity-0': paymentStore.loading }">
      <component
        :is="!dataStore.isProjectUser ? NuxtLink : 'span'"
        :to="!dataStore.isProjectUser ? { name: 'dashboard-payments' } : undefined"
      >
        <span class="inline-block whitespace-nowrap text-blue">
          <span class="icon-credits inline-block align-text-top text-xl"></span>
          <strong class="ml-2 mr-1 inline-block text-xs">
            {{ formatNumber(paymentStore.credit.balance || 0) }}
          </strong>
        </span>
      </component>
    </div>
    <Spinner v-if="paymentStore.loading" :size="28" />
  </div>
</template>

<script lang="ts" setup>
import { formatNumber } from '~/lib/utils/helpers';

const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const NuxtLink = resolveComponent('NuxtLink');

onMounted(async () => {
  await dataStore.waitOnPromises();
  await paymentStore.getCredits();
});
</script>
