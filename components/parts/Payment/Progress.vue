<template>
  <div>
    <span class="inline-block text-sm text-white"> {{ storagePercentage(size, totalSize) }}% </span>
    <n-progress
      class="w-full"
      type="line"
      border-radius="3px"
      :height="4"
      :percentage="storagePercentage(size, totalSize)"
      status="success"
    >
      <span></span>
    </n-progress>
    <div class="mt-1 flex justify-between text-xs">
      <span class="inline-block"> {{ formatBytes(size) }} </span>

      <span v-if="labelTotal" class="inline-block"> {{ formatBytes(totalSize) }} {{ labelTotal }} </span>
      <span v-else class="inline-block">
        {{ formatBytes(totalSize) }}
        <span class="lowercase">{{ $t('dashboard.total') }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storagePercentage, formatBytes } from '~/lib/utils/storage';

defineProps({
  size: { type: Number, default: 0 },
  totalSize: { type: Number, default: 0 },
  labelTotal: { type: String, default: '' },
});
</script>
