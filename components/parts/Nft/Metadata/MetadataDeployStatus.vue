<template>
  <Tag
    v-if="status !== null"
    :animation="status < MetadataDeployStatus.UPLOAD_METADATA_TO_IPFS"
    :type="getStatus(status)"
  >
    {{ $t(`nft.metadata.deployStatus.${status}`) }}
  </Tag>
</template>

<script lang="ts" setup>
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
