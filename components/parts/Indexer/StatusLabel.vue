<template>
  <Tag v-if="status !== null" :type="getStatus(status)">
    <span class="mx-1 uppercase">{{ $t(`indexer.statuses.${status}`) }}</span>
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number as PropType<IndexerStatuses>, default: 0 },
});

/** Deployment status */
function getStatus(status: number): TagType {
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
