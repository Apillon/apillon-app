<template>
  <div class="mx-auto h-full" :class="metadataStore.stepMetadata <= NftMetadataStep.NEW ? 'max-w-lg' : 'max-w-6xl'">
    <FormNftCollectionNetworkSelect v-if="metadataStore.stepMetadata === NftMetadataStep.CHAIN" />
    <FormNftMetadataSelect
      v-else-if="metadataStore.stepMetadata === NftMetadataStep.METADATA"
      @next-step="v => (step = v)"
    />
    <FormNftMetadataAmount
      v-else-if="metadataStore.stepMetadata === NftMetadataStep.NEW"
      @next-step="v => (step = v)"
    />
    <FormNftUploadSingle v-else-if="metadataStore.stepMetadata === NftMetadataStep.SINGLE" ref="formSingleRef" />
    <FormNftUpload v-else-if="metadataStore.stepMetadata === NftMetadataStep.CSV" />
    <NftPreview v-else>
      <Btn
        v-if="metadataStore.stepMetadata === NftMetadataStep.SINGLE_PREVIEW"
        size="small"
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
import { NftMetadataStep } from '~/lib/types/nft';

defineExpose({ back, nextStep });
const metadataStore = useMetadataStore();
const { createNftDataAsync } = useMetadata();

const step = ref(metadataStore.stepMetadata);

const formSingleRef = useTemplateRef('formSingleRef');
const submitFormSingle = async () => (formSingleRef.value ? await formSingleRef.value.handleSubmitForm() : false);
async function submitSingle() {
  const formSingleSubmitted = await submitFormSingle();
  if (formSingleSubmitted) {
    step.value += 1;
    metadataStore.stepMetadata = step.value;
  }
}

function back() {
  switch (metadataStore.stepMetadata) {
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
  metadataStore.stepMetadata = step.value;
}
function nextStep() {
  switch (metadataStore.stepMetadata) {
    case NftMetadataStep.SINGLE:
      submitSingle();
      break;
    case NftMetadataStep.CSV:
      createNftDataAsync();
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
      metadataStore.stepCollectionCreate += 1;
      break;
  }
  metadataStore.stepMetadata = step.value;
}
</script>
