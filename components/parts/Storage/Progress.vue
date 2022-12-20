<template>
  <n-progress
    class="lg:min-w-[400px]"
    type="line"
    border-radius="0"
    :height="4"
    :percentage="percentage"
    :status="status"
  >
    <span class="inline-block lg:min-w-[130px]">
      <span class="whitespace-nowrap">{{ bytesToMb(size) }}MB/</span>
      <span class="whitespace-nowrap">{{ bytesToMb(maxSize) }}MB</span>
    </span>
  </n-progress>
</template>

<script lang="ts" setup>
const props = defineProps({
  size: { type: Number, default: 0 },
  maxSize: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
});

const status = computed(() => {
  return props.percentage > 90 ? 'error' : props.percentage > 60 ? 'warning' : 'success';
});
</script>
