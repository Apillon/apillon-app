<template>
  <Tag v-if="status !== null" :animation="status < FileStatus.UPLOADED_TO_IPFS" :type="getStatus(status)">
    <span v-if="status < FileStatus.UPLOADED_TO_IPFS" class="mx-1 uppercase">{{ $t('general.pending') }}</span>
    <span v-else class="mx-1 uppercase">{{ $t(`storage.file.status.${status}`) }}</span>
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number, default: null },
});

/** Deployment status */
function getStatus(status: number): TagType {
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
