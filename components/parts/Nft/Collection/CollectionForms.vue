<template>
  <div class="flex-cc pt-4" style="min-height: calc(100dvh - 300px)">
    <div
      v-if="collectionStore.step === CollectionStep.STORAGE_TYPE"
      class="max-w-lg text-center pb-8"
    >
      <h2>{{ $t('nft.metadata.title') }}</h2>

      <p class="text-body whitespace-pre-line mb-8">
        {{ $t('nft.metadata.infoNew') }}
      </p>

      <Notification v-if="isFormDisabled" type="error" class="w-full mb-4">
        {{ $t('dashboard.permissions.insufficient') }}
      </Notification>
      <div class="flex flex-col gap-4 px-2">
        <Btn size="large" type="primary" :disabled="isFormDisabled" @click="goToWizard">
          {{ $t('nft.metadata.yes') }}
        </Btn>
        <Btn size="large" type="secondary" :disabled="isFormDisabled" @click="goToForm">
          <span class="inline-block -mx-1">{{ $t('nft.metadata.no') }}</span>
        </Btn>
      </div>
    </div>
    <div v-else-if="collectionStore.step === CollectionStep.ENVIRONMENT" class="text-center">
      <FormNftCollectionEnvironmentSelect />
    </div>
    <div v-else-if="collectionStore.step === CollectionStep.METADATA">
      <h2 class="mb-8 text-center">{{ $t('nft.collection.enterData') }}</h2>
      <FormNftCollectionBase />
    </div>
    <div v-else>
      <h2 class="mb-8 text-center">{{ $t('nft.collection.setBehavior') }}</h2>
      <FormNftCollectionBehavior />
    </div>
  </div>
</template>

<script lang="ts" setup>
const bucketStore = useBucketStore();
const collectionStore = useCollectionStore();
const { isFormDisabled } = useCollection();

function goToForm() {
  collectionStore.resetForms();
  collectionStore.metadataStored = true;
}

function goToWizard() {
  bucketStore.resetFolder();
  bucketStore.resetUpload();
  collectionStore.resetForms();
  collectionStore.metadataStored = false;
  collectionStore.step = CollectionStep.ENVIRONMENT;
}
</script>
