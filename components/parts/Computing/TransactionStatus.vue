<template>
  <Tag v-if="status !== null" :animation="status < ComputingTransactionStatus.WORKER_SUCCESS" :type="getStatus(status)">
    {{ $t(`computing.transaction.status.${status}`) }}
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number as PropType<ComputingTransactionStatus>, default: 1 },
});

/** Transaction status */
function getStatus(status: number): TagType {
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
