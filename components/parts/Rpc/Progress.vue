<template>
  <div class="flex items-center justify-between gap-y-2" :class="{ 'flex-wrap': wrap }">
    <span class="mr-2 inline-block">
      <span class="whitespace-nowrap text-body" :class="wrap ? 'text-xs' : 'text-sm'">
        {{
          $t('rpc.apiKey.monthlyUsage', {
            used: formatNumber(currentCalls),
            max: formatNumber(maxCalls),
          })
        }}
      </span>
    </span>
    <n-progress
      :class="{ 'min-w-[100px] md:min-w-[200px] lg:min-w-[300px] xl:min-w-[400px]': !wrap }"
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
import { formatNumber } from '~/lib/utils/helpers';
import { storagePercentage } from '~/lib/utils/storage';

defineProps({
  currentCalls: { type: Number, default: 0 },
  maxCalls: { type: Number, default: 0 },
  wrap: { type: Boolean, default: false },
});
</script>
