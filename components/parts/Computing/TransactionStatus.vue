<template>
  <n-tag
    v-bind="$attrs"
    :type="getComputingTransactionStatus(transactionStatus)"
    :bordered="transactionStatus < ComputingTransactionStatus.CONFIRMED"
    size="tiny"
    round
  >
    <n-space
      :class="transactionStatus < ComputingTransactionStatus.CONFIRMED ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1 uppercase">
        {{ $t(`computing.transaction.status.${transactionStatus}`) }}
      </span>
      <AnimationTyping v-if="transactionStatus < ComputingTransactionStatus.WORKER_SUCCESS" />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
import { ComputingTransactionStatus } from '~/lib/types/computing';

defineProps({
  transactionStatus: { type: Number as PropType<ComputingTransactionStatus>, default: 1 },
});

/** Transaction status */
function getComputingTransactionStatus(status: number): TagType {
  switch (status) {
    case ComputingTransactionStatus.PENDING:
      return 'warning';
    case ComputingTransactionStatus.CONFIRMED:
      return 'info';
    case ComputingTransactionStatus.WORKER_SUCCESS:
      return 'success';
    default:
      return 'error';
  }
}
</script>
