<template>
  <n-tag
    v-bind="$attrs"
    :type="getDeploymentStatus(deploymentStatus)"
    :bordered="deploymentStatus === DeploymentStatus.INITIATED"
    size="tiny"
    round
  >
    <n-space
      :class="deploymentStatus === DeploymentStatus.INITIATED ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1">{{ $t(`hosting.deployment.status.${deploymentStatus}`) }}</span>
      <AnimationTyping v-if="deploymentStatus < DeploymentStatus.IN_REVIEW" />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
import { DeploymentStatus } from '~/lib/types/storage';

defineProps({
  deploymentStatus: {
    type: Number as PropType<DeploymentStatus>,
    default: DeploymentStatus.INITIATED,
  },
});

/** Deployment status */
function getDeploymentStatus(status: number): TagType {
  switch (status) {
    case DeploymentStatus.IN_PROGRESS:
      return 'info';
    case DeploymentStatus.IN_REVIEW:
      return 'warning';
    case DeploymentStatus.APPROVED:
      return 'success';
    case DeploymentStatus.SUCCESSFUL:
      return 'success';
    case DeploymentStatus.FAILED:
      return 'error';
    case DeploymentStatus.REJECTED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
