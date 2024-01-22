<template>
  <n-tag
    v-bind="$attrs"
    :type="getTransactionType(transactionType)"
    :bordered="false"
    size="tiny"
    round
  >
    <n-space class="text-bg-dark" :size="0" align="center" :wrap="false">
      <span class="mx-1 uppercase">{{ $t(`computing.transaction.type.${transactionType}`) }}</span>
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
import { ContractTransactionType } from '#imports';

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
