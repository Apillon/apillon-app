<template>
  <ModalFullScreen :progress="progress" :title="$t('nft.collection.create')">
    <template #header-center>
      <div class="flex items-center gap-4 text-xs">
        <template v-for="(step, key) in enumValues(CollectionCreateStep)">
          <span v-if="key > 0 && $te(`nft.collection.createStep.${step}`)" class="card-border w-3"></span>
          <strong
            v-if="$te(`nft.collection.createStep.${step}`)"
            :class="step === metadataStore.stepCollectionCreate ? 'text-yellow' : 'text-disabled'"
          >
            {{ $t(`nft.collection.createStep.${step}`) }}
          </strong>
        </template>
      </div>
    </template>

    <slot>
      <NftMetadataWizard
        v-if="metadataStore.stepCollectionCreate === CollectionCreateStep.METADATA"
        ref="metadataRef"
      />
      <div v-if="metadataStore.stepCollectionCreate === CollectionCreateStep.SMART_CONTRACT" class="mx-auto max-w-lg">
        <h4>{{ $t(`nft.collection.createStep.${CollectionCreateStep.SMART_CONTRACT}`) }}</h4>
        <p>{{ $t('nft.collection.instruction.smartContract') }}</p>
        <FormNftCollectionSmartContract ref="formSmartContractRef" class="my-6" hide-submit />
      </div>
      <div v-if="metadataStore.stepCollectionCreate === CollectionCreateStep.VISUAL" class="mx-auto max-w-lg">
        <h4>{{ $t(`nft.collection.createStep.${CollectionCreateStep.VISUAL}`) }}</h4>
        <p>{{ $t('nft.collection.instruction.visuals') }}</p>
        <FormNftCollectionVisual ref="formVisualRef" class="my-6" hide-submit />
      </div>
      <NftPreviewCollection v-else-if="metadataStore.stepCollectionCreate === CollectionCreateStep.REVIEW" />
      <AnimationDeploy v-else-if="metadataStore.stepCollectionCreate === CollectionCreateStep.DEPLOYING" />
      <NftPreviewFinish v-else-if="metadataStore.stepCollectionCreate === CollectionCreateStep.DEPLOYED" />
    </slot>
    <template v-if="metadataStore.stepCollectionCreate !== CollectionCreateStep.REVIEW" #footer>
      <div class="flex w-full items-center justify-between gap-4 px-10 py-3">
        <p>
          <strong>Total costs: </strong>
          <span>1 credits</span>
        </p>
        <div class="flex items-center gap-2">
          <Btn v-if="showBack" size="small" type="secondary" @click="back">
            {{ $t('general.back') }}
          </Btn>
          <Btn size="small" @click="nextStep">
            <template v-if="metadataStore.stepMetadata === NftMetadataStep.SINGLE">
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
const metadataStore = useMetadataStore();

const metadataRef = useTemplateRef('metadataRef');
const formVisualRef = useTemplateRef('formVisualRef');
const formSmartContractRef = useTemplateRef('formSmartContractRef');

const showBack = computed(
  () =>
    metadataStore.stepMetadata !== NftMetadataStep.CHAIN ||
    metadataStore.stepCollectionCreate !== CollectionCreateStep.METADATA
);

const progress = computed(() => {
  const baseProgress = 15 * (metadataStore.stepCollectionCreate - 1);
  if (metadataStore.stepCollectionCreate === CollectionCreateStep.METADATA) {
    switch (metadataStore.stepMetadata) {
      case NftMetadataStep.CHAIN:
      case NftMetadataStep.METADATA:
      case NftMetadataStep.NEW:
        return baseProgress + 10 * (metadataStore.stepMetadata - 1);
      case NftMetadataStep.SINGLE:
      case NftMetadataStep.CSV:
      case NftMetadataStep.ENDPOINT:
      case NftMetadataStep.JSON:
        return baseProgress + 10 * (NftMetadataStep.SINGLE - 1);
      default:
        return baseProgress + 10 * (NftMetadataStep.SINGLE_PREVIEW - 1);
    }
  }
  return baseProgress;
});

onMounted(() => {
  storageStore.getStorageInfo();
});
const submitForm = async formRef => (formRef ? await formRef.handleSubmitForm() : false);

async function submitFormSmartContract() {
  if (await submitForm(formSmartContractRef.value)) {
    metadataStore.stepCollectionCreate = CollectionCreateStep.VISUAL;
  }
}
async function submitFormVisual() {
  if (await submitForm(formVisualRef.value)) {
    metadataStore.stepCollectionCreate = CollectionCreateStep.REVIEW;
  }
}

function back() {
  switch (metadataStore.stepCollectionCreate) {
    case CollectionCreateStep.METADATA:
      metadataRef.value?.back();
      break;
    default:
      metadataStore.stepCollectionCreate -= 1;
  }
}
function nextStep() {
  switch (metadataStore.stepCollectionCreate) {
    case CollectionCreateStep.METADATA:
      metadataRef.value?.nextStep();
      break;
    case CollectionCreateStep.SMART_CONTRACT:
      submitFormSmartContract();
      break;
    case CollectionCreateStep.VISUAL:
      submitFormVisual();
      break;
    case CollectionCreateStep.REVIEW:
      break;
    default:
      metadataStore.stepCollectionCreate = CollectionCreateStep.METADATA;
  }
}
</script>
