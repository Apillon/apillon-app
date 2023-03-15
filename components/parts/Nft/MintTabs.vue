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
    <n-tab-pane
      :name="NftMintTab.IMAGES"
      :disabled="!collectionStore.hasCsvFile || !collectionStore.csvSession"
    >
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
      :disabled="
        !collectionStore.hasCsvFile ||
        !collectionStore.csvSession ||
        !collectionStore.hasImages ||
        !collectionStore.imagesSession
      "
    >
      <template #tab>
        <IconNumber :number="3" :active="collectionStore.mintTab === NftMintTab.MINT" />
        <span class="ml-2">{{ $t('nft.collection.mintNfts') }}</span>
      </template>
      <slot>
        <FormNftDeploy />
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
</script>
