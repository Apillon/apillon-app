<template>
  <div class="p-3 border-b-1 border-bg-lighter">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col w-full mr-4">
        <strong class="body-md">{{ name }}</strong>
        <span class="body-sm text-body">{{ folderPath(fullPath) }}</span>
      </div>
      <div class="flex items-center justify-end min-w-[40px]">
        <IconSuccessful v-if="status === FileUploadStatusValue.FINISHED" />
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
      class="w-full mt-2"
      :color="colors.primary"
      :percentage="percentage"
      :rail-color="colors.bg.lighter"
    />
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
  if (parts.length <= 1) {
    return '';
  }
  return parts.slice(0, -1).join(' / ');
}
</script>
