<template>
  <!-- <span>pan</span> -->
  <n-tag
    v-bind="$attrs"
    :type="getCollectionStatus(contractStatus)"
    :bordered="contractStatus < SmartContractStatus.DEPLOYED"
    size="tiny"
    round
  >
    <n-space
      :class="contractStatus < SmartContractStatus.DEPLOYED ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1 uppercase">{{
        $t(`dashboard.service.smartContracts.status.${contractStatus}`)
      }}</span>
      <AnimationTyping
        v-if="
          contractStatus < SmartContractStatus.DEPLOYED ||
          contractStatus === SmartContractStatus.TRANSFERRING
        "
      />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
defineProps({
  contractStatus: {
    type: Number,
    validator: (contractStatus: number) =>
      Object.values(SmartContractStatus).includes(contractStatus),
    default: 0,
  },
});

/** Deployment status */
function getCollectionStatus(status: number): TagType {
  switch (status) {
    case SmartContractStatus.DEPLOYED:
    case SmartContractStatus.TRANSFERRED:
      return 'success';
    case SmartContractStatus.DEPLOYING:
    case SmartContractStatus.TRANSFERRING:
      return 'info';
    case SmartContractStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
