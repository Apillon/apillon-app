<template>
  <div class="mx-auto max-w-lg pb-8 text-center">
    <h2>{{ t('nft.metadata.title') }}</h2>

    <p class="mb-8 whitespace-pre-line text-body">
      {{ t('nft.metadata.infoNew') }}
    </p>

    <Notification v-if="isFormDisabled" type="error" class="mb-4 w-full">
      {{ t('dashboard.permissions.insufficient') }}
    </Notification>
    <div class="flex flex-col gap-4 px-2">
      <Btn size="large" type="primary" :disabled="isFormDisabled" @click="collectionStore.metadataStored = false">
        {{ t('nft.metadata.yes') }}
      </Btn>
      <Btn size="large" type="secondary" :disabled="isFormDisabled" @click="collectionStore.metadataStored = true">
        <span class="-mx-1 inline-block">{{ t('nft.metadata.no') }}</span>
      </Btn>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const collectionStore = useCollectionStore();
const { isFormDisabled, resetAll } = useCollection();

onMounted(() => {
  resetAll();
});
</script>
