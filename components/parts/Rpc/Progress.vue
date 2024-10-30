<template>
  <div class="flex justify-between items-center gap-y-2" :class="{ 'flex-wrap': wrap }">
    <span class="inline-block mr-2">
      <span class="text-body whitespace-nowrap" :class="wrap ? 'text-xs' : 'text-sm'">
        {{
          $t('rpc.apiKey.monthlyUsage', {
            used: formatNumber(currentCalls),
            max: formatNumber(maxCalls),
          })
        }}
      </span>
    </span>
    <n-progress
      :class="{ 'xl:min-w-[400px] lg:min-w-[300px] md:min-w-[200px] min-w-[100px]': !wrap }"
      type="line"
      border-radius="3px"
      :height="4"
      :percentage="storagePercentage(currentCalls, maxCalls)"
      status="warning"
    >
      <span></span>
    </n-progress>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  currentCalls: { type: Number, default: 0 },
  maxCalls: { type: Number, default: 0 },
  wrap: { type: Boolean, default: false },
});
</script>
