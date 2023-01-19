<template>
  <div class="flex p-3 border-b-1 border-bg-lighter">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col w-full mr-4">
        <strong class="body-md">{{ name }}</strong>
        <span class="body-sm text-body">{{ folderPath(fullPath) }}</span>
        <n-progress
          v-if="status === FileUploadStatusValue.UPLOADING"
          :key="percentage"
          type="line"
          :color="colors.primary"
          :percentage="percentage"
        />
      </div>
      <div class="flex items-center justify-end min-w-[40px]">
        <button v-if="status === FileUploadStatusValue.PENDING" @click="onRemoveFile">
          <span class="icon-close align-middle text-2xl"></span>
        </button>
        <span
          v-else-if="status === FileUploadStatusValue.UPLOADING"
          class="icon-delete align-middle text-2xl"
        ></span>
        <IconSuccessful v-else-if="status === FileUploadStatusValue.FINISHED" />
        <span
          v-else-if="status === FileUploadStatusValue.ERROR"
          class="icon-close align-middle text-2xl text-pink"
        ></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import colors from '~~/tailwind.colors';

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
  if (parts.length <= 2) {
    return '';
  }
  return parts.slice(0, -1).join(' / ');
}
</script>
