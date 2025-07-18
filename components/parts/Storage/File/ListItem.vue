<template>
  <div class="border-b-1 border-bg-lighter p-3">
    <div class="flex w-full items-center justify-between">
      <div class="mr-4 flex w-full flex-col">
        <strong class="body-md">{{ name }}</strong>
        <span class="body-sm text-body">{{ folderPath(fullPath) }}</span>
      </div>
      <div class="flex min-w-[40px] items-center justify-end">
        <IconSuccess v-if="status === FileUploadStatusValue.FINISHED" />
        <button v-else-if="status === FileUploadStatusValue.ERROR" @click="onRemoveFile">
          <span class="icon-close align-middle text-2xl text-pink"></span>
        </button>
        <button v-else @click="onRemoveFile">
          <span class="icon-close align-middle text-2xl"></span>
        </button>
      </div>
    </div>
    <n-progress
      v-if="status === FileUploadStatusValue.UPLOADING"
      :key="percentage"
      type="line"
      class="mt-2 w-full"
      :color="colors.primary"
      :percentage="percentage"
      :rail-color="colors.bg.lighter"
    />
  </div>
</template>

<script lang="ts" setup>
import { FileUploadStatusValue } from '~/lib/types/storage';
import { colors } from '~/tailwind.config';

const props = defineProps({
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  fullPath: { type: String, default: '' },
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

/** Remove file from list */
const emit = defineEmits(['removeFile']);
function onRemoveFile() {
  emit('removeFile', props.id);
}

function folderPath(pullPath: string) {
  const parts = pullPath.split('/').filter(p => p);
  if (parts.length <= 1) {
    return '';
  }
  return parts.slice(0, -1).join(' / ');
}
</script>
