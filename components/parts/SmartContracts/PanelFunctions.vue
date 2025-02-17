<template>
  <div class="w-full">
    <div class="rounded-lg px-3 py-2" :class="bgClass">
      <h4 class="my-3">
        {{ title }}
      </h4>
      <n-card v-for="fn in functions" :key="fn.name" class="my-1 mb-3 max-w-lg" :bordered="false" size="small">
        <n-collapse accordion arrow-placement="right">
          <n-collapse-item :title="labelInfoText(fn.name, fn?.description)">
            <!-- Assign a form ref according to function ref - we have multiple form on same site -->
            <FormSmartContractAction :fn="fn" :read="read" :owner="owner" />
          </n-collapse-item>
        </n-collapse>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  bgClass: { type: String, default: '' },
  functions: { type: Array<SmartContractABI>, default: [] },
  owner: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  title: { type: String, default: '' },
});
const { labelInfoText } = useComputing();
</script>
