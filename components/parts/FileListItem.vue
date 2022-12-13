<template>
  <div class="flex pt-2 pb-1">
    <div class="w-full">
      <div class="">
        <span class="text-sm mr-4">{{ name }}</span>
        <span class="text-sm opacity-60">{{ formatBytes(size) }}</span>
      </div>
      <n-progress
        type="line"
        :color="color"
        :key="percentage"
        :percentage="percentage"
        :border-radius="0"
        :height="4"
      />
    </div>
    <div class="flex items-center justify-end min-w-[80px]">
      <span
        v-if="status === FileUploadStatusValue.FINISHED"
        class="icon-check text-lg text-green"
      ></span>
      <span
        v-else-if="status === FileUploadStatusValue.UPLOADING"
        class="icon-delete text-lg"
      ></span>
      <span
        v-else-if="status === FileUploadStatusValue.ERROR"
        class="icon-close text-lg text-pink"
      ></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useThemeVars } from 'naive-ui';

const props = defineProps({
  name: { type: String, default: '' },
  size: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  status: {
    type: String,
    validator: (type: string) =>
      [
        FileUploadStatusValue.PENDING.toString(),
        FileUploadStatusValue.UPLOADING.toString(),
        FileUploadStatusValue.ERROR.toString(),
        FileUploadStatusValue.FINISHED.toString(),
        FileUploadStatusValue.REMOVED.toString(),
      ].includes(type),
    default: FileUploadStatusValue.PENDING,
  },
});

const themeVars = useThemeVars();
const color = computed(() => {
  switch (props.status) {
    case FileUploadStatusValue.ERROR:
      return themeVars.value.errorColor;
    default:
      return themeVars.value.successColor;
  }
});
</script>
