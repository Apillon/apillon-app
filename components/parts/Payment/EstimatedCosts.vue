<template>
  <n-button class="rounded-lg" size="small" @click="modalCostsVisible = true">
    <span class="icon-credits text-xl mr-2"></span>
    {{ $t('dashboard.credits.checkPrice') }}
  </n-button>
  <Modal v-model:show="modalCostsVisible" title="Estimated cost">
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
        <span>Your funds</span>
        <strong class="text-blue">{{ paymentsStore.credit.balance }} credits</strong>
      </div>

      <Btn class="my-8" type="secondary" size="large" @click="modalCostsVisible = false">
        I understand
      </Btn>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
defineProps({
  description: { type: String, default: '' },
  prices: { type: Array<{ chain: string; credits: number }>, default: '' },
});

const paymentsStore = usePaymentsStore();
const modalCostsVisible = ref<boolean>(false);
</script>
