<template>
  <n-space :wrap="false" align="center">
    <span class="inline-block lg:min-w-[130px]">
      <span class="whitespace-nowrap">
        {{ $t('storage.usage', { used: formatBytes(size), max: formatBytes(maxSize) }) }}
      </span>
    </span>
    <n-progress
      class="xl:min-w-[400px] lg:min-w-[300px] md:min-w-[200px] min-w-[100px]"
      type="line"
      border-radius="3px"
      :height="4"
      :percentage="percentage"
      status="warning"
    >
      <span></span>
    </n-progress>
  </n-space>
</template>

<script lang="ts" setup>
defineProps({
  size: { type: Number, default: 0 },
  maxSize: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
});
</script>
