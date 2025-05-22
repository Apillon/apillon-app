<template>
  <Tag v-if="status !== null" :animation="status < DeploymentStatus.IN_REVIEW" :type="getStatus(status)">
    {{ $t(`hosting.deployment.status.${status}`) }}
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number as PropType<DeploymentStatus>, default: null },
});

/** Deployment status */
function getStatus(status: number): TagType {
  switch (status) {
    case DeploymentStatus.INITIATED:
    case DeploymentStatus.IN_PROGRESS:
      return 'default';
    case DeploymentStatus.IN_REVIEW:
      return 'warning';
    case DeploymentStatus.APPROVED:
    case DeploymentStatus.SUCCESSFUL:
      return 'success';
    default:
      return 'error';
  }
}
</script>
