<template>
  <Tag
    v-if="status !== null"
    :animation="status < SmartContractStatus.DEPLOYED || status === SmartContractStatus.TRANSFERRING"
    :type="getStatus(status)"
  >
    {{ $t(`smartContracts.status.${status}`) }}
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number as PropType<SmartContractStatus>, default: SmartContractStatus.CREATED },
});

/** Deployment status */
function getStatus(status: number): TagType {
  switch (status) {
    case SmartContractStatus.DEPLOYED:
    case SmartContractStatus.TRANSFERRED:
      return 'success';
    case SmartContractStatus.DEPLOYING:
    case SmartContractStatus.TRANSFERRING:
      return 'info';
    case SmartContractStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
