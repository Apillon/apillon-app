<template>
  <n-space class="pb-8" :size="32" vertical>
    <n-upload
      v-if="collectionStore.hasImages"
      accept="image/png, image/jpeg"
      :default-file-list="collectionStore.images"
      :show-preview-button="false"
      :show-remove-button="false"
      :show-retry-button="false"
      :max="collectionStore.csvData?.length || undefined"
      list-type="image-card"
      multiple
      directory-dnd
      :custom-request="nft.uploadImagesRequest"
      @change="nft.handleImageChange"
      @remove="nft.handleImageRemove"
    />
    <n-upload
      v-else
      accept="image/png, image/jpeg"
      :default-file-list="collectionStore.images"
      :show-file-list="false"
      :max="collectionStore.csvData?.length || undefined"
      multiple
      directory-dnd
      :custom-request="nft.uploadImagesRequest"
    >
      <n-upload-dragger style="height: calc(100vh - 420px)">
        <div class="py-2 text-center">
          <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
            <span class="icon-upload text-violet text-2xl"></span>
          </div>

          <h4 class="mb-1">{{ $t('nft.upload.images') }}</h4>
          <span class="text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
        </div>
      </n-upload-dragger>
    </n-upload>
    <n-space v-if="collectionStore.hasImages" justify="space-between">
      <div>
        <Notification
          v-if="collectionStore.images?.length < collectionStore.csvData?.length"
          type="warning"
        >
          {{ $t('nft.validation.imagesMissing') }} {{ nft.missingImages }}
        </Notification>
        <Notification v-else-if="!nft.allImagesUploaded" type="error">
          {{ $t('nft.validation.imagesInvalid') }} {{ nft.imagesNames }}
        </Notification>
      </div>
      <Btn
        v-if="collectionStore.hasImages"
        type="primary"
        :disabled="!nft.allImagesUploaded"
        @click="collectionStore.mintTab = NftMintTab.MINT"
      >
        {{ $t('nft.upload.imagesConfirm') }}
      </Btn>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const collectionStore = useCollectionStore();
const nft = useNft();
</script>
