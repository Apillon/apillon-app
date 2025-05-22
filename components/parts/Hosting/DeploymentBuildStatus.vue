<template>
  <Tag
    v-if="status !== null"
    :animation="[DeploymentBuildStatus.PENDING, DeploymentBuildStatus.IN_PROGRESS].includes(status)"
    :type="getStatus(status)"
  >
    {{ $t(`hosting.deploy.build-table.status.${status}`) }}
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: {
    type: Number as PropType<DeploymentBuildStatus>,
    default: DeploymentBuildStatus.PENDING,
  },
});

/** Deployment status */
function getStatus(status: number): TagType {
  switch (status) {
    case DeploymentBuildStatus.PENDING:
      return 'info';
    case DeploymentBuildStatus.IN_PROGRESS:
      return 'warning';
    case DeploymentBuildStatus.SUCCESS:
      return 'success';
    case DeploymentBuildStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
