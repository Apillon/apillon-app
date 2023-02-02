<template>
  <n-tag
    v-bind="$attrs"
    :class="{ '!pl-0': deploymentStatus < DeploymentStatus.SUCCESSFUL }"
    :type="getDeploymentStatus(deploymentStatus)"
    :bordered="deploymentStatus === DeploymentStatus.INITIATED"
    size="tiny"
    round
  >
    <n-space
      :class="deploymentStatus === DeploymentStatus.INITIATED ? 'text-body' : 'text-bg-dark'"
      align="center"
    >
      <Spinner
        v-if="deploymentStatus < DeploymentStatus.SUCCESSFUL"
        class="!relative !w-5 !h-5 !m-0"
      />
      <span class="mx-1">{{ $t(`hosting.deployment.status.${deploymentStatus}`) }}</span>
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
defineProps({
  deploymentStatus: {
    type: Number,
    validator: (deploymentStatus: number) =>
      [
        DeploymentStatus.INITIATED,
        DeploymentStatus.IN_PROGRESS,
        DeploymentStatus.SUCCESSFUL,
        DeploymentStatus.FAILED,
      ].includes(deploymentStatus),
    default: DeploymentStatus.INITIATED,
  },
});

/** Deployment status */
function getDeploymentStatus(status: number): TagType {
  switch (status) {
    case DeploymentStatus.IN_PROGRESS:
      return 'info';
    case DeploymentStatus.SUCCESSFUL:
      return 'success';
    case DeploymentStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
