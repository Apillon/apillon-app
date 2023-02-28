<template>
  <n-tag
    v-bind="$attrs"
    :type="getTransactionStatus(transactionStatus)"
    :bordered="transactionStatus < TransactionStatus.FINISHED"
    size="tiny"
    round
  >
    <n-space
      :class="transactionStatus < TransactionStatus.FINISHED ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1 uppercase">{{ $t(`nft.transaction.status.${transactionStatus}`) }}</span>
      <Spinner
        v-if="transactionStatus < TransactionStatus.FINISHED"
        class="!relative !w-5 !h-5 !m-0 !left-0"
      />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
defineProps({
  transactionStatus: {
    type: Number,
    validator: (transactionStatus: number) =>
      [
        TransactionStatus.REQUESTED,
        TransactionStatus.PENDING,
        TransactionStatus.FINISHED,
        TransactionStatus.VERIFIED,
        TransactionStatus.FAILED,
      ].includes(transactionStatus),
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
