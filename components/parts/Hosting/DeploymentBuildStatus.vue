<template>
  <n-tag
    v-bind="$attrs"
    :type="getDeploymentBuildStatus(buildStatus)"
    :bordered="buildStatus === DeploymentBuildStatus.PENDING"
    size="tiny"
    round
  >
    <n-space
      :class="buildStatus === DeploymentBuildStatus.PENDING ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1">{{ $t(`hosting.deploy.build-table.status.${buildStatus}`) }}</span>
      <AnimationTyping
        v-if="[DeploymentBuildStatus.PENDING, DeploymentBuildStatus.IN_PROGRESS].includes(buildStatus)"
      />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
defineProps({
  buildStatus: {
    type: Number as PropType<DeploymentBuildStatus>,
    default: DeploymentBuildStatus.PENDING,
  },
});

/** Deployment status */
function getDeploymentBuildStatus(status: number): TagType {
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
