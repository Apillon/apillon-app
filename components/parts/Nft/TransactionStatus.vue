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
      <AnimationTyping v-if="transactionStatus < TransactionStatus.FINISHED" />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
import { TransactionStatus } from '~/lib/types/nft';

defineProps({
  transactionStatus: { type: Number as PropType<TransactionStatus>, default: 0 },
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
