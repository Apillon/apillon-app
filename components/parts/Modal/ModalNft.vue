<template>
  <ModalFullScreen :progress="progress" :title="$t('nft.collection.create')">
    <template #header-center>
      <div class="flex items-center gap-4 text-xs">
        <template v-for="(step, key) in enumValues(CollectionCreateStep)">
          <span v-if="key > 0 && $te(`nft.collection.createStep.${step}`)" class="card-border w-3"></span>
          <strong
            v-if="$te(`nft.collection.createStep.${step}`)"
            :class="step === collectionStore.stepCollectionCreate ? 'text-yellow' : 'text-disabled'"
          >
            {{ $t(`nft.collection.createStep.${step}`) }}
          </strong>
        </template>
      </div>
    </template>

    <slot>
      <NftMetadataWizard
        v-if="collectionStore.stepCollectionCreate === CollectionCreateStep.METADATA"
        ref="metadataRef"
      />
      <div v-if="collectionStore.stepCollectionCreate === CollectionCreateStep.SMART_CONTRACT" class="mx-auto max-w-lg">
        <FormNftCollectionBase ref="formBaseRef" class="mb-6" hide-submit />
        <FormNftCollectionBehavior ref="formBehaviorRef" hide-submit />
      </div>
    </slot>
    <template #footer>
      <div class="flex w-full items-center justify-between gap-4 px-10 py-3">
        <p>
          <strong>Total costs: </strong>
          <span>1 credits</span>
        </p>
        <div class="flex items-center gap-2">
          <Btn
            v-if="
              collectionStore.stepMetadata !== NftMetadataStep.CHAIN ||
              collectionStore.stepCollectionCreate !== CollectionCreateStep.METADATA
            "
            size="small"
            type="secondary"
            @click="back"
          >
            {{ $t('general.back') }}
          </Btn>
          <Btn size="small" @click="nextStep">
            <template v-if="collectionStore.stepMetadata === NftMetadataStep.SINGLE">
              {{ $t('nft.add') }}
            </template>
            <template v-else>{{ $t('form.continue') }}</template>
          </Btn>
        </div>
      </div>
    </template>
  </ModalFullScreen>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import { enumValues } from '~/lib/utils';
import { CollectionCreateStep, NftMetadataStep } from '~/lib/types/nft';

const storageStore = useStorageStore();
const collectionStore = useCollectionStore();

const metadataRef = useTemplateRef('metadataRef');
const formBaseRef = useTemplateRef('formBaseRef');
const formBehaviorRef = useTemplateRef('formBehaviorRef');

const progress = computed(() => {
  const baseProgress = 25 * (collectionStore.stepCollectionCreate - 1);
  if (collectionStore.stepCollectionCreate === CollectionCreateStep.METADATA) {
    switch (collectionStore.stepMetadata) {
      case NftMetadataStep.CHAIN:
      case NftMetadataStep.METADATA:
      case NftMetadataStep.NEW:
        return baseProgress + 5 * (collectionStore.stepMetadata - 1);
      case NftMetadataStep.SINGLE:
      case NftMetadataStep.CSV:
      case NftMetadataStep.ENDPOINT:
      case NftMetadataStep.JSON:
        return baseProgress + 5 * (NftMetadataStep.SINGLE - 1);
      default:
        return baseProgress + 5 * (NftMetadataStep.SINGLE_PREVIEW - 1);
    }
  }
  return baseProgress;
});

onMounted(() => {
  storageStore.getStorageInfo();
});
const submitFormBase = async () => (formBaseRef.value ? await formBaseRef.value.handleSubmitForm() : false);
const submitFormBehavior = async () => (formBehaviorRef.value ? await formBehaviorRef.value.handleSubmitForm() : false);

async function submitForms() {
  const formBaseSubmitted = await submitFormBase();
  const formBehaviorSubmitted = await submitFormBehavior();

  if (formBaseSubmitted && formBehaviorSubmitted) {
    collectionStore.stepCollectionCreate = CollectionCreateStep.VISUAL;
  }
}

function back() {
  switch (collectionStore.stepCollectionCreate) {
    case CollectionCreateStep.METADATA:
      metadataRef.value?.back();
      break;
    default:
      collectionStore.stepCollectionCreate = CollectionCreateStep.METADATA;
  }
}
function nextStep() {
  switch (collectionStore.stepCollectionCreate) {
    case CollectionCreateStep.METADATA:
      metadataRef.value?.nextStep();
      break;
    case CollectionCreateStep.SMART_CONTRACT:
      submitForms();
      break;
    default:
      collectionStore.stepCollectionCreate = CollectionCreateStep.METADATA;
  }
}
</script>
