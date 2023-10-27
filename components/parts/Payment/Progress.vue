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
    <div class="flex justify-between mt-1 text-xs">
      <span class="inline-block"> {{ formatBytes(size) }} </span>

      <span v-if="labelTotal" class="inline-block">
        {{ formatBytes(totalSize) }} {{ labelTotal }}
      </span>
      <span v-else class="inline-block">
        {{ formatBytes(totalSize) }}
        <span class="lowercase">{{ $t('dashboard.total') }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  size: { type: Number, default: 0 },
  totalSize: { type: Number, default: 0 },
  labelTotal: { type: String, default: '' },
});
</script>
