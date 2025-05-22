<template>
  <Tag v-if="status !== null" :animation="status < ContractStatus.DEPLOYED" :type="getStatus(status)">
    {{ ContractStatus[status] }}
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number, default: null },
});

/** Deployment status */
function getStatus(status: number): TagType {
  switch (status) {
    case ContractStatus.DEPLOY_INITIATED:
      return 'warning';
    case ContractStatus.DEPLOYING:
      return 'warning';
    case ContractStatus.DEPLOYED:
      return 'success';
    case ContractStatus.TRANSFERRED:
      return 'success';
    case ContractStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
