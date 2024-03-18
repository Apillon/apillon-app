<template>
  <div class="max-w-xl">
    <div class="mb-4">
      <h2>{{ $t('nft.collection.preview') }}</h2>
      <p>
        {{ $t('nft.collection.previewInfo') }}
      </p>
    </div>
    <div class="mb-4">
      <Image :src="createThumbnailUrl(collectionStore.form.base.coverImage)" class="h-40" />
    </div>
    <div>
      <Btn class="primary" @click="handleAddNft">{{ $t('nft.add') }}</Btn>
    </div>
  </div>
</template>

<script setup lang="ts">
const collectionStore = useCollectionStore();

function createThumbnailUrl(file: FileListItemType): string {
  if (file.file) {
    return window.URL.createObjectURL(file.file);
  }
  return '';
}

function handleAddNft() {
  collectionStore.resetImages();
  collectionStore.resetFile();
  collectionStore.resetSingleFormData();
  collectionStore.nftStep = NftCreateStep.AMOUNT;
}
</script>
