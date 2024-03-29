<template>
  <n-tabs ref="mintTabsRef" v-model:value="collectionStore.mintTab" type="segment" animated>
    <n-tab-pane :name="NftCreateTab.METADATA">
      <template #tab>
        <IconNumber
          v-if="collectionStore.mintTab === NftCreateTab.METADATA"
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
      :name="NftCreateTab.IMAGES"
      :disabled="!collectionStore.hasCsvFile || !collectionStore.hasMetadata"
    >
      <template #tab>
        <IconSuccessful v-if="collectionStore.mintTab === NftCreateTab.DEPLOY" />
        <IconNumber v-else :number="2" :active="collectionStore.mintTab === NftCreateTab.IMAGES" />
        <span class="ml-2">{{ $t('nft.collection.uploadImages') }}</span>
      </template>
      <slot>
        <FormNftUploadImages />
      </slot>
    </n-tab-pane>
    <n-tab-pane
      :name="NftCreateTab.DEPLOY"
      :disabled="
        !collectionStore.hasCsvFile ||
        !collectionStore.hasMetadata ||
        !collectionStore.hasImages ||
        !allImagesUploaded
      "
    >
      <template #tab>
        <IconNumber :number="3" :active="collectionStore.mintTab === NftCreateTab.DEPLOY" />
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
    if (
      tab === NftCreateTab.DEPLOY &&
      (!collectionStore.hasCsvFile || !collectionStore.hasImages)
    ) {
      collectionStore.mintTab = NftCreateTab.IMAGES;
      nextTick(() => mintTabsRef.value?.syncBarPosition());
    } else if (tab === NftCreateTab.IMAGES && !collectionStore.hasCsvFile) {
      collectionStore.mintTab = NftCreateTab.METADATA;
      nextTick(() => mintTabsRef.value?.syncBarPosition());
    }
  }
);
</script>
