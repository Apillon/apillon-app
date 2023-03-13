<template>
  <n-tabs v-model:value="collectionStore.mintTab" ref="mintTabsRef" type="segment" animated>
    <n-tab-pane :name="NftMintTab.METADATA">
      <template #tab>
        <IconNumber
          v-if="collectionStore.mintTab === NftMintTab.METADATA"
          :number="1"
          :active="true"
        />
        <IconSuccessful v-else />
        <span class="ml-2">{{ $t('nft.collection.uploadMetadata') }}</span>
      </template>
      <slot>
        <FormNftUploadCsvFile />
      </slot>
    </n-tab-pane>
    <n-tab-pane :name="NftMintTab.IMAGES" :disabled="!collectionStore.hasCsvFile">
      <template #tab>
        <IconSuccessful v-if="collectionStore.mintTab === NftMintTab.MINT" />
        <IconNumber v-else :number="2" :active="collectionStore.mintTab === NftMintTab.IMAGES" />
        <span class="ml-2">{{ $t('nft.collection.uploadImages') }}</span>
      </template>
      <slot>
        <FormNftUploadImages />
      </slot>
    </n-tab-pane>
    <n-tab-pane
      :name="NftMintTab.MINT"
      :disabled="!collectionStore.hasCsvFile || !collectionStore.hasImages"
    >
      <template #tab>
        <IconNumber :number="3" :active="collectionStore.mintTab === NftMintTab.MINT" />
        <span class="ml-2">{{ $t('nft.collection.mintNfts') }}</span>
      </template>
      <slot>
        <n-space class="pb-8" :size="32" vertical>
          <div class="grid gap-8 grid-flow-col auto-cols-[minmax(0,250px)]">
            <div v-for="image in collectionStore.images" :key="image.id">
              <figure class="flex flex-col h-full">
                <img
                  :src="createThumbnailUrl(image)"
                  class="w-full h-full object-contain"
                  :alt="image.name"
                />
                <figcaption class="block h-12 px-4 py-3 bg-white text-bg font-bold">
                  {{ image.name }}
                </figcaption>
              </figure>
            </div>
          </div>
          <n-space justify="space-between">
            <div></div>
            <Btn type="primary" @click="">
              {{ $t('nft.upload.deploy') }}
            </Btn>
          </n-space>
        </n-space>
      </slot>
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
const collectionStore = useCollectionStore();

const mintTabsRef = ref<NTabsInst | null>(null);

/** Watch active tab, if informations are missing, open previous tab */
watch(
  () => collectionStore.mintTab,
  tab => {
    if (tab === NftMintTab.MINT && (!collectionStore.hasCsvFile || !collectionStore.hasImages)) {
      collectionStore.mintTab = NftMintTab.IMAGES;
      nextTick(() => mintTabsRef.value?.syncBarPosition());
    } else if (tab === NftMintTab.IMAGES && !collectionStore.hasCsvFile) {
      collectionStore.mintTab = NftMintTab.METADATA;
      nextTick(() => mintTabsRef.value?.syncBarPosition());
    }
  }
);

function createThumbnailUrl(file: FileListItemType): string {
  if (file.file) {
    return window.URL.createObjectURL(file.file);
  }
  return '';
}
</script>
