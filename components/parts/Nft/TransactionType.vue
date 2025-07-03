<template>
  <Tag v-if="transactionType !== null" :type="getTransactionType(transactionType)">
    {{ $t(`nft.transaction.type.${transactionType}`) }}
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  transactionType: { type: Number, default: 1 },
});

/** Deployment status */
function getTransactionType(status: number): TagType {
  switch (status) {
    case TransactionType.DEPLOY_CONTRACT:
      return 'success';
    case TransactionType.TRANSFER_CONTRACT_OWNERSHIP:
      return 'warning';
    case TransactionType.BURN_NFT:
      return 'error';
    default:
      return 'info';
  }
}
</script>
