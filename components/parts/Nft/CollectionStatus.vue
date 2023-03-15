<template>
  <n-tag
    v-bind="$attrs"
    :type="getCollectionStatus(collectionStatus)"
    :bordered="collectionStatus < CollectionStatus.DEPLOYED"
    size="tiny"
    round
  >
    <n-space
      :class="collectionStatus < CollectionStatus.DEPLOYED ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1 uppercase">{{ $t(`nft.collection.status.${collectionStatus}`) }}</span>
      <Spinner
        v-if="collectionStatus < CollectionStatus.DEPLOYED"
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
      Object.values(CollectionStatus).includes(collectionStatus),
    default: 0,
  },
});

/** Deployment status */
function getCollectionStatus(status: number): TagType {
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
