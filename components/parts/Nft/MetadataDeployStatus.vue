<template>
  <n-tag
    v-bind="$attrs"
    :type="getStatus(status)"
    :bordered="status < PrepareCollectionMetadataStep.UPLOAD_METADATA_TO_IPFS"
    size="tiny"
    round
  >
    <n-space
      :class="
        status < PrepareCollectionMetadataStep.UPLOAD_METADATA_TO_IPFS
          ? 'text-body'
          : 'text-bg-dark'
      "
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1 uppercase">{{ $t(`nft.metadata.deployStatus.${status}`) }}</span>
      <AnimationTyping v-if="status < PrepareCollectionMetadataStep.UPLOAD_METADATA_TO_IPFS" />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
import { PrepareCollectionMetadataStep } from '~/lib/types/nft';

defineProps({
  status: { type: Number as PropType<PrepareCollectionMetadataStep>, default: 0 },
});

function getStatus(status: number): TagType {
  switch (status) {
    case PrepareCollectionMetadataStep.UPLOAD_METADATA_TO_IPFS:
      return 'info';
    case PrepareCollectionMetadataStep.METADATA_SUCCESSFULLY_PREPARED:
      return 'success';
    default:
      return 'default';
  }
}
</script>
