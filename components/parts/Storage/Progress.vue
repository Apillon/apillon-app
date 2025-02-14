<template>
  <div class="flex items-center justify-between gap-y-2" :class="{ 'flex-wrap': wrap }">
    <span :class="[{ 'mr-2 inline-block': !wrap }, { 'flex w-full justify-between': !!label }]">
      <span v-if="label">{{ label }}</span>

      <span v-if="unit" class="whitespace-nowrap text-xs">
        <span class="text-body">{{ formatBytes(size) }}</span>
        <strong> / {{ formatBytes(maxSize) }} {{ unit }}</strong>
      </span>
      <span v-else class="whitespace-nowrap text-body" :class="wrap ? 'text-xs' : 'text-sm'">
        {{ $t('storage.usage', { used: formatBytes(size), max: formatBytes(maxSize) }) }}
      </span>
    </span>
    <n-progress
      :class="{ 'min-w-[100px] md:min-w-[200px] lg:min-w-[300px] xl:min-w-[400px]': !wrap }"
      type="line"
      border-radius="3px"
      :height="4"
      :percentage="storagePercentage(size, maxSize)"
      status="warning"
    >
      <span></span>
    </n-progress>
  </div>
</template>

<script lang="ts" setup>
import { storagePercentage, formatBytes } from '~/lib/utils/storage';

defineProps({
  label: { type: String, default: null },
  unit: { type: String, default: null },
  size: { type: Number, default: 0 },
  maxSize: { type: Number, default: 0 },
  wrap: { type: Boolean, default: false },
});
</script>
