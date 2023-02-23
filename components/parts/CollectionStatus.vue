<template>
  <n-tag
    v-bind="$attrs"
    :type="getCollectionStatus(collectionStatus)"
    :bordered="collectionStatus === CollectionStatus.PENDING"
    size="tiny"
    round
  >
    <n-space
      :class="collectionStatus === CollectionStatus.PENDING ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1 uppercase">{{ $t(`nft.collection.status.${collectionStatus}`) }}</span>
      <Spinner
        v-if="collectionStatus < CollectionStatus.TRANSFERED"
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
      [CollectionStatus.PENDING, CollectionStatus.DEPLOYED, CollectionStatus.TRANSFERED].includes(
        collectionStatus
      ),
    required: true,
  },
});

/** Deployment status */
function getCollectionStatus(status: number): TagType {
  switch (status) {
    case CollectionStatus.DEPLOYED:
      return 'warning';
    case CollectionStatus.TRANSFERED:
      return 'success';
    default:
      return 'warning';
  }
}
</script>
