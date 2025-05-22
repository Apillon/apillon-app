<template>
  <Tag v-if="status !== null" :animation="status < FileUploadSessionStatus.FINISHED" :type="getStatus(status)">
    {{ $t(`storage.session.status.${status}`) }}
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number, default: null },
});

function getStatus(status: number): TagType {
  switch (status) {
    case FileUploadSessionStatus.CREATED:
      return 'default';
    case FileUploadSessionStatus.PROCESSED:
      return 'info';
    case FileUploadSessionStatus.VALIDATION_FAILED:
      return 'error';
    default:
      return 'success';
  }
}
</script>
