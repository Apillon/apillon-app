<template>
  <n-tabs ref="mintTabsRef" v-model:value="collectionStore.mintTab" type="segment" animated>
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
      :disabled="!collectionStore.hasCsvFile || !collectionStore.hasMetadata"
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
        !collectionStore.hasMetadata ||
        !collectionStore.hasImages ||
        !allImagesUploaded
      "
    >
      <template #tab>
        <IconNumber :number="3" :active="collectionStore.mintTab === NftMintTab.MINT" />
        <span class="ml-2">{{ $t('nft.collection.upload') }}</span>
      </template>
      <slot>
        <FormNftDeploy />
      </slot>
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
import type { TabsInst } from 'naive-ui';

const collectionStore = useCollectionStore();
const { allImagesUploaded } = useNft();

const mintTabsRef = ref<TabsInst | null>(null);

/** Watch active tab, if information are missing, open previous tab */
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
