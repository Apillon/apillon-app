<template>
  <n-tag
    v-bind="$attrs"
    :type="getContractStatus(contractStatus)"
    :bordered="contractStatus < ContractStatus.DEPLOYED"
    size="tiny"
    round
  >
    <n-space
      :class="contractStatus < ContractStatus.DEPLOYED ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1 uppercase">{{ ContractStatus[contractStatus] }}</span>
      <AnimationTyping v-if="contractStatus < ContractStatus.DEPLOYED" />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
defineProps({
  contractStatus: {
    type: Number,
    default: 0,
  },
});

/** Deployment status */
function getContractStatus(status: number): TagType {
  switch (status) {
    case ContractStatus.DEPLOY_INITIATED:
      return 'warning';
    case ContractStatus.DEPLOYING:
      return 'warning';
    case ContractStatus.DEPLOYED:
      return 'success';
    case ContractStatus.TRANSFERRED:
      return 'success';
    case ContractStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
