<template>
  <Tag
    v-if="deploymentStatus !== null"
    :animation="deploymentStatus < DeploymentStatus.IN_REVIEW"
    :type="getDeploymentStatus(deploymentStatus)"
  >
    {{ $t(`hosting.deployment.status.${deploymentStatus}`) }}
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  deploymentStatus: { type: Number as PropType<DeploymentStatus>, default: null },
});

/** Deployment status */
function getDeploymentStatus(status: number): TagType {
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
