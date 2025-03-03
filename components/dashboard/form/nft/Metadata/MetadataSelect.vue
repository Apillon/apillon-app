<template>
  <div class="">
    <h2>{{ t('nft.collection.createStep.1') }}</h2>
    <p>{{ t('nft.metadata.startFresh') }}</p>

    <NftCardSelect
      icon="nft/metadata"
      title="I want a fresh start"
      content="Start by adding new NFTs"
      :selected="selectedMetadata === 'new'"
      @click="selectedMetadata = 'new'"
    />

    <strong>OR select from existing</strong>

    <div class="mx-auto my-6 flex flex-col gap-4 whitespace-pre-line">
      <NftCardSelect
        v-for="metadata in []"
        icon="nft/metadata"
        :title="metadata.name"
        :content="metadata.length"
        :selected="selectedMetadata === metadata"
        @click="selectedMetadata = metadata"
      >
      </NftCardSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();

const selectedMetadata = ref<string>('');

onMounted(() => {
  collectionStore.getQuota();
});
</script>
