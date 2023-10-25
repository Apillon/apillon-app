<template>
  <n-tag
    v-bind="$attrs"
    :type="getTransactionStatus(contractStatus)"
    :bordered="contractStatus < TransactionStatus.FINISHED"
    size="tiny"
    round
  >
    <n-space
      :class="contractStatus < TransactionStatus.FINISHED ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1 uppercase">{{ $t(`computing.contract.status.${contractStatus}`) }}</span>
      <AnimationTyping v-if="contractStatus < TransactionStatus.FINISHED" />
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
function getTransactionStatus(status: number): TagType {
  switch (status) {
    case TransactionStatus.PENDING:
      return 'warning';
    case TransactionStatus.FINISHED:
      return 'success';
    case TransactionStatus.VERIFIED:
      return 'success';
    case TransactionStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
