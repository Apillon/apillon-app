<template>
  <div>
    <p class="mb-8 text-body">Description</p>

    <n-table class="plain" :bordered="false" :single-line="true">
      <thead>
        <tr>
          <th>Chain</th>
          <th class="!text-right">Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(price, key) in prices" :key="key">
          <td>{{ price.chain }}</td>
          <td class="text-right">~{{ price.credits }} credits</td>
        </tr>
      </tbody>
    </n-table>

    <div class="bg-bg-lighter flex justify-between p-2 mt-8 rounded">
      <strong>Your funds</strong>
      <strong class="text-blue">{{ paymentsStore.credit.balance }} credits</strong>
    </div>

    <Btn class="mt-8" type="secondary" size="large" @click="$emit('confirm')"> I understand </Btn>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['confirm']);
defineProps({
  description: { type: String, default: '' },
  prices: { type: Array<{ chain: string; credits: number }>, default: '' },
});

const paymentsStore = usePaymentsStore();
</script>
