<template>
  <Tag v-if="deployment !== null" :type="getStatus(deployment.status, deployment.failed)">
    <span class="mx-1 uppercase">
      {{ deploySuccess(deployment.status, deployment.failed) ? 'success' : 'failed' }}
    </span>
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  deployment: { type: Object as PropType<IndexerDeploymentInterface>, default: null },
});

/** Deployment status */
function deploySuccess(status: string, failed: string): boolean {
  return status === 'OK' || failed !== 'NO';
}
function getStatus(status: string, failed: string): TagType {
  return deploySuccess(status, failed) ? 'success' : 'error';
}
</script>
