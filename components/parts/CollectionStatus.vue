<template>
  <n-tag
    v-bind="$attrs"
    :type="getCollectionStatus(collectionStatus)"
    :bordered="collectionStatus === CollectionStatus.INITIATED"
    size="tiny"
    round
  >
    <n-space
      :class="collectionStatus === CollectionStatus.INITIATED ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1 uppercase">{{ $t(`nft.collection.status.${collectionStatus}`) }}</span>
      <Spinner
        v-if="collectionStatus < CollectionStatus.SUCCESSFUL"
        class="!relative !w-5 !h-5 !m-0 !left-0"
      />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
defineProps({
  collectionStatus: {
    type: Number,
    validator: (collectionStatus: number) =>
      [
        CollectionStatus.INITIATED,
        CollectionStatus.IN_PROGRESS,
        CollectionStatus.SUCCESSFUL,
        CollectionStatus.FAILED,
      ].includes(collectionStatus),
    default: CollectionStatus.INITIATED,
  },
});

/** Deployment status */
function getCollectionStatus(status: number): TagType {
  switch (status) {
    case CollectionStatus.IN_PROGRESS:
      return 'warning';
    case CollectionStatus.SUCCESSFUL:
      return 'success';
    case CollectionStatus.FAILED:
      return 'error';
    default:
      return 'warning';
  }
}
</script>
