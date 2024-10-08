<template>
  <div class="flex justify-between items-center gap-y-2" :class="{ 'flex-wrap': wrap }">
    <span class="inline-block mr-2">
      <span class="text-body whitespace-nowrap" :class="wrap ? 'text-xs' : 'text-sm'">
        {{ $t('storage.usage', { used: formatBytes(size), max: formatBytes(maxSize) }) }}
      </span>
    </span>
    <n-progress
      :class="{ 'xl:min-w-[400px] lg:min-w-[300px] md:min-w-[200px] min-w-[100px]': !wrap }"
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
defineProps({
  size: { type: Number, default: 0 },
  maxSize: { type: Number, default: 0 },
  wrap: { type: Boolean, default: false },
});
</script>
