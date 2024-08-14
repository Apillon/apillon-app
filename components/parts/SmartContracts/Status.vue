<template>
  <n-tag
    v-bind="$attrs"
    :type="getCollectionStatus(contractStatus)"
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
      <span class="mx-1 uppercase">{{ $t(`nft.collection.status.${contractStatus}`) }}</span>
      <AnimationTyping
        v-if="
          contractStatus < ContractStatus.DEPLOYED || contractStatus === ContractStatus.TRANSFERRING
        "
      />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
defineProps({
  contractStatus: {
    type: Number,
    validator: (contractStatus: number) => Object.values(ContractStatus).includes(contractStatus),
    default: 0,
  },
});

/** Deployment status */
function getCollectionStatus(status: number): TagType {
  switch (status) {
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
