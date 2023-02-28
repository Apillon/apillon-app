<template>
  <n-tag
    v-bind="$attrs"
    :type="getTransactionType(transactionType)"
    :bordered="false"
    size="tiny"
    round
  >
    <n-space class="text-bg-dark" :size="0" align="center" :wrap="false">
      <span class="mx-1 uppercase">{{ $t(`nft.transaction.type.${transactionType}`) }}</span>
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
defineProps({
  transactionType: { type: Number, default: 1 },
});

/** Deployment status */
function getTransactionType(status: number): TagType {
  switch (status) {
    case TransactionType.DEPLOY_CONTRACT:
      return 'info';
    default:
      return 'info';
  }
}
</script>
