<template>
  <div class="mx-auto h-full" :class="metadataStore.stepMetadata <= NftMetadataStep.NEW ? 'max-w-lg' : 'max-w-6xl'">
    <FormNftCollectionNetworkSelect v-if="metadataStore.stepMetadata === NftMetadataStep.CHAIN" />
    <!-- <FormNftMetadataSelect
      v-else-if="metadataStore.stepMetadata === NftMetadataStep.METADATA"
      @next-step="v => (step = v)"
    /> -->
    <FormNftMetadataAmount
      v-else-if="metadataStore.stepMetadata === NftMetadataStep.NEW"
      @next-step="v => (step = v)"
    />
    <FormNftUploadSingle v-else-if="metadataStore.stepMetadata === NftMetadataStep.SINGLE" ref="formSingleRef" />
    <FormNftUpload v-else-if="metadataStore.stepMetadata === NftMetadataStep.CSV" />
    <NftPreview v-else>
      <Btn
        v-if="metadataStore.stepMetadata === NftMetadataStep.SINGLE_PREVIEW"
        type="secondary"
        class="locked !min-w-0 lg:-translate-y-full"
        @click="back()"
      >
        <span class="flex items-center gap-2">
          <span class="icon-add rounded-md p-1 text-xl text-yellow"></span>
          <span>{{ $t('nft.add') }}</span>
        </span>
      </Btn>
    </NftPreview>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

defineExpose({ back, nextStep });
const { t } = useI18n();
const { warning } = useMessage();
const metadataStore = useMetadataStore();
const { allImagesUploaded, hasRequiredMetadata, missingImages, createNftDataAsync } = useMetadata();

const step = ref(metadataStore.stepMetadata);

const formSingleRef = useTemplateRef('formSingleRef');
const submitFormSingle = async () => (formSingleRef.value ? await formSingleRef.value.handleSubmitForm() : false);

function back() {
  switch (metadataStore.stepMetadata) {
    case NftMetadataStep.CHAIN:
      step.value = NftMetadataStep.CHAIN;
      break;
    case NftMetadataStep.NEW:
      step.value = NftMetadataStep.CHAIN;
      break;
    case NftMetadataStep.CSV:
    case NftMetadataStep.SINGLE:
    case NftMetadataStep.ENDPOINT:
    case NftMetadataStep.JSON:
      step.value = NftMetadataStep.NEW;
      break;
    default:
      step.value -= 1;
      break;
  }
  metadataStore.stepMetadata = step.value;
}
async function nextStep() {
  switch (metadataStore.stepMetadata) {
    case NftMetadataStep.SINGLE:
      if (await submitFormSingle()) {
        step.value += 1;
        metadataStore.stepMetadata = step.value;
      }
      break;
    case NftMetadataStep.CSV:
      if (!metadataStore.hasCsvFile) {
        warning(t('nft.validation.fileInvalid'));
      } else if (!hasRequiredMetadata.value) {
        warning(t('nft.validation.csvMissingAttributes'));
      } else if (!allImagesUploaded.value) {
        warning(t('nft.validation.imagesMissing') + ' ' + missingImages.value);
      } else {
        createNftDataAsync();
        step.value += 1;
      }
      break;
    case NftMetadataStep.CHAIN:
      step.value = NftMetadataStep.NEW;
      break;
    case NftMetadataStep.ENDPOINT:
    case NftMetadataStep.JSON:
      step.value += 1;
      break;
    case NftMetadataStep.SINGLE_PREVIEW:
    case NftMetadataStep.CSV_PREVIEW:
    case NftMetadataStep.ENDPOINT_PREVIEW:
    case NftMetadataStep.JSON_PREVIEW:
      metadataStore.stepCollectionCreate += 1;
      break;
  }
  metadataStore.stepMetadata = step.value;
}
</script>
