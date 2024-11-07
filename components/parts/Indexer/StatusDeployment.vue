<template>
  <n-tag
    v-bind="$attrs"
    :type="getIndexerStatus(deployment.status, deployment.failed)"
    :bordered="false"
    size="tiny"
    round
  >
    <n-space :class="'text-bg-dark'" :size="0" align="center" :wrap="false">
      <span class="mx-1 uppercase">
        {{ deploySuccess(deployment.status, deployment.failed) ? 'success' : 'failed' }}
      </span>
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';

defineProps({
  deployment: {
    type: Object as PropType<IndexerDeploymentInterface>,
    default: {},
  },
});

/** Deployment status */
function deploySuccess(status: string, failed: string): boolean {
  return status === 'OK' || failed !== 'NO';
}
function getIndexerStatus(status: string, failed: string): TagType {
  return deploySuccess(status, failed) ? 'success' : 'error';
}
</script>
