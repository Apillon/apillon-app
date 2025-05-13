<template>
  <n-tag
    v-bind="$attrs"
    :type="getStatus(status)"
    :bordered="status < MetadataDeployStatus.UPLOAD_METADATA_TO_IPFS"
    size="tiny"
    round
  >
    <n-space
      :class="status < MetadataDeployStatus.UPLOAD_METADATA_TO_IPFS ? 'text-body' : 'text-bg-dark'"
      :size="0"
      align="center"
      :wrap="false"
    >
      <span class="mx-1 uppercase">{{ $t(`nft.metadata.deployStatus.${status}`) }}</span>
      <AnimationTyping v-if="status < MetadataDeployStatus.UPLOAD_METADATA_TO_IPFS" />
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
import { MetadataDeployStatus } from '~/lib/types/nft';

defineProps({
  status: { type: Number as PropType<MetadataDeployStatus>, default: 0 },
});

function getStatus(status: number): TagType {
  switch (status) {
    case MetadataDeployStatus.UPLOAD_METADATA_TO_IPFS:
      return 'info';
    case MetadataDeployStatus.PUBLISH_TO_IPNS:
      return 'info';
    case MetadataDeployStatus.METADATA_SUCCESSFULLY_PREPARED:
      return 'success';
    default:
      return 'default';
  }
}
</script>
