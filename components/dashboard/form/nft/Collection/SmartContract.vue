<template>
  <div class="mx-auto max-w-lg">
    <h4>{{ $t('nft.collection.smartContract') }}</h4>

    <template v-if="simplet">
      <p class="mb-6">{{ $t('nft.collection.instruction.smartContract') }}</p>
      <FormNftCollectionSmartContractBase
        ref="formBaseRef"
        :show-network="metadataStore.form.smartContract.chain === undefined"
        :simplet="simplet"
      />
      <FormNftCollectionSmartContractBehavior ref="formBehaviorRef" :simplet="simplet" />
      <FormNftCollectionSmartContractDrop ref="formDropRef" :simplet="simplet" />
    </template>
    <template v-else-if="isStep(CollectionFormStep.BASE)">
      <p class="mb-6">{{ $t('nft.collection.instruction.smartContract') }}</p>
      <FormNftCollectionSmartContractBase
        ref="formBaseRef"
        :show-network="metadataStore.form.smartContract.chain === undefined"
        :simplet="simplet"
      />
    </template>
    <template v-else-if="isStep(CollectionFormStep.BEHAVIOR)">
      <h6 class="mt-6">{{ $t('nft.collection.instruction.behavior') }}</h6>
      <p class="mb-6">{{ $t('nft.collection.instruction.behaviorInfo') }}</p>
      <FormNftCollectionSmartContractBehavior ref="formBehaviorRef" :simplet="simplet" />
    </template>
    <template v-else-if="isStep(CollectionFormStep.ROYALTIES)">
      <h6 class="mt-6">{{ $t('nft.collection.instruction.royalties') }}</h6>
      <p class="mb-6">{{ $t('nft.collection.instruction.royaltiesInfo') }}</p>
      <FormNftCollectionSmartContractRoyalties ref="formRoyaltiesRef" />
    </template>
    <template v-else-if="isStep(CollectionFormStep.DROP)">
      <h6 class="mt-6">{{ $t('nft.collection.instruction.drop') }}</h6>
      <p class="mb-6">{{ $t('nft.collection.instruction.dropInfo') }}</p>
      <FormNftCollectionSmartContractDrop ref="formDropRef" :simplet="simplet" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';

defineExpose({ back, nextStep });
const props = defineProps({
  hideSubmit: { type: Boolean, default: false },
  showNetwork: { type: Boolean, default: true },
  showIpns: { type: Boolean, default: true },
  simplet: { type: Boolean, default: false },
});

const { t } = useI18n();
const { warning } = useMessage();
const { isUnique } = useCollection();
const metadataStore = useMetadataStore();

const formBaseRef = useTemplateRef('formBaseRef');
const formBehaviorRef = useTemplateRef('formBehaviorRef');
const formRoyaltiesRef = useTemplateRef('formRoyaltiesRef');
const formDropRef = useTemplateRef('formDropRef');

const isStep = (step: CollectionFormStep) => metadataStore.stepSmartContract === step;
const submitForm = async formRef => (formRef ? await formRef.handleSubmitForm() : false);

async function submitFormWrapper(formRef) {
  if (await submitForm(formRef)) {
    metadataStore.stepSmartContract += 1;
  }
}
async function submitFormBehavior() {
  if (await submitForm(formBehaviorRef.value)) {
    if (isUnique.value) {
      metadataStore.stepCollectionCreate = CollectionCreateStep.VISUAL;
    } else {
      metadataStore.stepSmartContract += 1;
    }
  }
}
async function submitFormDrop() {
  if (await submitForm(formDropRef.value)) {
    metadataStore.stepCollectionCreate = CollectionCreateStep.VISUAL;
  }
}

function back() {
  if (props.simplet || metadataStore.stepSmartContract === CollectionFormStep.BASE) {
    metadataStore.stepCollectionCreate = CollectionCreateStep.METADATA;
  } else {
    metadataStore.stepSmartContract -= 1;
  }
}
async function nextStep() {
  if (props.simplet) {
    const f1 = await submitForm(formBaseRef.value);
    const f2 = await submitForm(formBehaviorRef.value);
    const f3 = await submitForm(formDropRef.value);

    if (Number(metadataStore.form.smartContract.dropPrice) <= 0) {
      warning(t('validation.collection.dropPrice'));
    } else if (f1 && f2 && f3) {
      metadataStore.stepCollectionCreate = CollectionCreateStep.VISUAL;
    }
    return;
  }
  switch (metadataStore.stepSmartContract) {
    case CollectionFormStep.BASE:
      submitFormWrapper(formBaseRef.value);
      break;
    case CollectionFormStep.BEHAVIOR:
      submitFormBehavior();
      break;
    case CollectionFormStep.ROYALTIES:
      submitFormWrapper(formRoyaltiesRef.value);
      break;
    case CollectionFormStep.DROP:
      submitFormDrop();
      break;
  }
}
</script>
