<template>
  <Tag v-if="status !== null" :animation="status < TransactionStatus.CONFIRMED" :type="getStatus(status)">
    {{ $t(`nft.transaction.status.${status}`) }}
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number as PropType<TransactionStatus>, default: 0 },
});

/** Deployment status */
function getStatus(status: number): TagType {
  switch (status) {
    case TransactionStatus.PENDING:
      return 'warning';
    case TransactionStatus.CONFIRMED:
      return 'success';
    case TransactionStatus.FAILED:
    case TransactionStatus.ERROR:
      return 'error';
    default:
      return 'default';
  }
}
</script>
