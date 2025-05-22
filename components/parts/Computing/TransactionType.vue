<template>
  <Tag v-if="status !== null" :type="getTransactionType(transactionType)">
    {{ $t(`computing.transaction.type.${status}`) }}
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  transactionType: { type: Number as PropType<ContractTransactionType>, default: 1 },
});

/** Deployment status */
function getTransactionType(status: number): TagType {
  switch (status) {
    case ContractTransactionType.DEPLOY_CONTRACT:
      return 'success';
    case ContractTransactionType.TRANSFER_CONTRACT_OWNERSHIP:
      return 'info';
    case ContractTransactionType.ASSIGN_CID_TO_NFT:
      return 'success';
    default:
      return 'warning';
  }
}
</script>
