<template>
  <Tag v-if="status !== null" :animation="status < CollectionStatus.DEPLOYED" :type="getStatus(status)">
    {{ $t(`nft.collection.status.${status}`) }}
  </Tag>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number as PropType<CollectionStatus>, default: null },
});

/** Deployment status */
function getStatus(status: number): TagType {
  switch (status) {
    case CollectionStatus.DEPLOYED:
      return 'success';
    case CollectionStatus.TRANSFERRED:
      return 'success';
    case CollectionStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
}
</script>
