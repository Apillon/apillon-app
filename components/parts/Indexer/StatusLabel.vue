<template>
  <!-- <span>pan</span> -->
  <n-tag
    v-bind="$attrs"
    :type="getIndexerStatus(indexerStatus)"
    :bordered="false"
    size="tiny"
    round
  >
    <n-space :class="'text-bg-dark'" :size="0" align="center" :wrap="false">
      <span class="mx-1 uppercase">{{ $t(`indexer.statuses.${indexerStatus}`) }}</span>
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
import { IndexerStatuses } from '../../../lib/types/indexer';

defineProps({
  indexerStatus: {
    type: Number,
    validator: (indexerStatus: number) => Object.values(IndexerStatuses).includes(indexerStatus),
    default: 0,
  },
});

/** Deployment status */
function getIndexerStatus(status: number): TagType {
  switch (status) {
    case IndexerStatuses.ACTIVE:
      return 'success';
    case IndexerStatuses.CREATED:
      return 'info';
    case IndexerStatuses.HIBERNATED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
