<template>
  <Tag v-if="status !== null" :animation="status < ResourceStatus.ONLINE" :type="getStatus(status)">
    <template v-if="$te(`simplet.status.${status}`)">
      {{ $t(`simplet.status.${status}`) }}
    </template>
    <span v-else class="capitalize">{{ ResourceStatus[status].replaceAll('_', ' ').toLowerCase() }}</span>
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number as PropType<ResourceStatus>, default: null },
});

function getStatus(status: number): TagType {
  switch (status) {
    case ResourceStatus.FAILED:
      return 'error';
    case ResourceStatus.DEPLOYING:
    case ResourceStatus.RESTARTING:
      return 'info';
    case ResourceStatus.ONLINE:
      return 'success';
    default:
      return 'default';
  }
}
</script>
