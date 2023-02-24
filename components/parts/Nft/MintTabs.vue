<template>
  <n-tabs v-model:value="currentTab" type="segment" animated>
    <n-tab-pane name="uploadMetadata">
      <template #tab>
        <IconNumber :number="1" :active="currentTab === 'uploadMetadata'" />
        <span class="ml-2">{{ $t('nft.collection.uploadMetadata') }}</span>
      </template>
      <slot>
        <FormNftUploadCsvFile />
      </slot>
    </n-tab-pane>
    <n-tab-pane name="uploadImages">
      <template #tab>
        <IconNumber :number="2" :active="currentTab === 'uploadImages'" />
        <span class="ml-2">{{ $t('nft.collection.uploadImages') }}</span>
      </template>
    </n-tab-pane>
    <n-tab-pane name="mintNfts">
      <template #tab>
        <IconNumber :number="3" :active="currentTab === 'mintNfts'" />
        <span class="ml-2">{{ $t('nft.collection.mintNfts') }}</span>
      </template>
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
/** Active tab value */
const currentTab = ref<string>('uploadMetadata');
</script>
