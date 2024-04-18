<template>
  <n-tag
    v-bind="$attrs"
    :type="getUploadSessionStatus(status)"
    :bordered="isCreated"
    size="tiny"
    round
  >
    <n-space
      :class="isCreated ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="uppercase">{{ FileUploadSessionStatus[status] }}</span>
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
const props = defineProps({
  status: { type: Number, default: 1 },
});

const isCreated = computed<boolean>(() => {
  return props.status === FileUploadSessionStatus.CREATED;
});

/** Deployment status */
function getUploadSessionStatus(status: number): TagType {
  switch (status) {
    case FileUploadSessionStatus.CREATED:
      return 'default';
    case FileUploadSessionStatus.PROCESSED:
      return 'info';
    default:
      return 'success';
  }
}
</script>
