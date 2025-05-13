<template>
  <n-tag v-bind="$attrs" :type="getFileStatus(fileStatus)" :bordered="isPending" size="tiny" round>
    <n-space :class="isPending ? 'text-body' : 'text-bg-dark'" :size="0" align="center" :wrap="false">
      <span v-if="isPending" class="mx-1 uppercase">{{ $t('general.pending') }}</span>
      <span v-else class="mx-1 uppercase">{{ $t(`storage.file.status.${fileStatus}`) }}</span>
      <AnimationTyping v-if="isPending" />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
const props = defineProps({
  fileStatus: { type: Number, default: 1 },
});

const isPending = computed<boolean>(() => {
  return props.fileStatus < FileStatus.UPLOADED_TO_IPFS;
});

/** Deployment status */
function getFileStatus(status: number): TagType {
  switch (status) {
    case FileStatus.REQUEST_FOR_UPLOAD_GENERATED:
      return 'default';
    case FileStatus.UPLOADED_TO_S3:
      return 'warning';
    default:
      return 'success';
  }
}
</script>
