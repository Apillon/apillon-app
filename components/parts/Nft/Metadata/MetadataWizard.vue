<template>
  <div class="mx-auto h-full" :class="collectionStore.stepMetadata <= NftMetadataStep.NEW ? 'max-w-lg' : 'max-w-6xl'">
    <FormNftCollectionNetworkSelect v-if="collectionStore.stepMetadata === NftMetadataStep.CHAIN" />
    <FormNftMetadataSelect
      v-else-if="collectionStore.stepMetadata === NftMetadataStep.METADATA"
      @next-step="v => (step = v)"
    />
    <FormNftMetadataAmount
      v-else-if="collectionStore.stepMetadata === NftMetadataStep.NEW"
      @next-step="v => (step = v)"
    />
    <FormNftUploadSingle v-else-if="collectionStore.stepMetadata === NftMetadataStep.SINGLE" />
    <FormNftUpload v-else-if="collectionStore.stepMetadata === NftMetadataStep.CSV" />
    <NftPreview v-else />
  </div>
</template>

<script setup lang="ts">
import { NftMetadataStep } from '~/lib/types/nft';

defineExpose({ back, nextStep });
const collectionStore = useCollectionStore();

const step = ref(collectionStore.stepMetadata);

function back() {
  switch (collectionStore.stepMetadata) {
    case NftMetadataStep.CHAIN:
      step.value = NftMetadataStep.CHAIN;
      break;
    case NftMetadataStep.SINGLE:
    case NftMetadataStep.CSV:
    case NftMetadataStep.ENDPOINT:
    case NftMetadataStep.JSON:
      step.value = NftMetadataStep.NEW;
      break;
    default:
      step.value -= 1;
      break;
  }
  collectionStore.stepMetadata = step.value;
}
function nextStep() {
  switch (collectionStore.stepMetadata) {
    case NftMetadataStep.CHAIN:
    case NftMetadataStep.SINGLE:
    case NftMetadataStep.CSV:
    case NftMetadataStep.ENDPOINT:
    case NftMetadataStep.JSON:
      step.value += 1;
      break;
    case NftMetadataStep.SINGLE_PREVIEW:
    case NftMetadataStep.CSV_PREVIEW:
    case NftMetadataStep.ENDPOINT_PREVIEW:
    case NftMetadataStep.JSON_PREVIEW:
      collectionStore.stepCollectionCreate += 1;
      break;
  }
  collectionStore.stepMetadata = step.value;
}
</script>
