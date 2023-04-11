<template>
  <div class="flex justify-center items-center" style="min-height: calc(100vh - 300px)">
    <div
      class="w-full text-center"
      :class="{ 'max-w-lg': collectionStore.stepUpload !== NftUploadStep.PREVIEW }"
    >
      <!-- Preview -->
      <template
        v-if="
          isStepAvailable(NftUploadStep.PREVIEW) &&
          collectionStore.stepUpload === NftUploadStep.PREVIEW
        "
      >
        <n-space class="pb-8" :size="32" vertical>
          <div class="grid gap-8 grid-cols-nft">
            <div v-for="image in collectionStore.images" :key="image.id">
              <figure class="flex flex-col h-full">
                <img
                  :src="createThumbnailUrl(image)"
                  class="w-full h-full object-contain"
                  :alt="image.name"
                />
                <!-- <figcaption class="block h-12 px-4 py-3 bg-white text-bg font-bold">
                  {{ image.name }}
                </figcaption> -->
              </figure>
            </div>
          </div>
          <n-space class="w-auto mx-auto" justify="center">
            <Btn
              class="w-60"
              type="secondary"
              @click="collectionStore.stepUpload = NftUploadStep.IMAGES"
            >
              {{ $t('nft.upload.takeMeBack') }}
            </Btn>
            <Btn class="w-60" type="primary" @click="collectionStore.mintTab = NftMintTab.MINT">
              {{ $t('general.confirm') }}
            </Btn>
          </n-space>
        </n-space>
      </template>

      <!-- Upload Img -->
      <template
        v-else-if="
          isStepAvailable(NftUploadStep.IMAGES) &&
          collectionStore.stepUpload === NftUploadStep.IMAGES
        "
      >
        <h2>{{ $t('nft.upload.images') }}</h2>
        <p class="text-body whitespace-pre-line">
          {{ $t('nft.upload.infoImages') }}
        </p>
        <p class="mb-6">
          <NuxtLink href="https://wiki.apillon.io/build/3-apillon-api.html" target="_blank">
            <Btn type="builders" size="tiny">
              <span class="inline-block leading-6 text-primary hover:text-bg-dark">
                {{ $t('general.learnMore') }}
              </span>
            </Btn>
          </NuxtLink>
        </p>
        <n-upload
          v-if="!collectionStore.hasImages"
          accept="image/png, image/jpeg"
          :default-file-list="collectionStore.images"
          :show-file-list="false"
          :max="collectionStore.csvData?.length || undefined"
          multiple
          directory-dnd
          :custom-request="uploadImagesRequest"
        >
          <n-upload-dragger class="h-40">
            <div class="py-2 text-center">
              <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
                <span class="icon-upload text-violet text-2xl"></span>
              </div>

              <h4 class="mb-1">{{ $t('nft.upload.images') }}</h4>
              <span class="text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
            </div>
          </n-upload-dragger>
        </n-upload>
        <div v-else class="flex text-left">
          <n-upload
            accept="image/png, image/jpeg"
            class="flex-1 w-full cursor-pointer"
            :show-file-list="false"
            :max="collectionStore.csvData?.length || undefined"
            multiple
            directory-dnd
            :custom-request="uploadImagesRequest"
            @change="handleImageChange"
            @remove="handleImageRemove"
          >
            <div class="px-4 py-2 border-1 border-bg-lighter">
              <span class="icon-image text-xl align-sub mr-3"></span>
              <span>{{ collectionStore.images.length }}</span>
              &nbsp;
              <span>{{ $t('general.images') }}</span>
            </div>
          </n-upload>
          <div class="">
            <button
              class="flex justify-center items-center h-12 w-12 ml-4 p-3"
              @click="collectionStore.resetImages()"
            >
              <span class="icon-delete text-xl"></span>
            </button>
          </div>
        </div>

        <n-space class="mt-5" :size="20" justify="space-between" vertical>
          <div v-if="collectionStore.hasImages">
            <Notification
              v-if="collectionStore.images?.length < collectionStore.csvData?.length"
              type="warning"
            >
              {{ $t('nft.validation.imagesMissing') }} {{ missingImages }}
            </Notification>
            <Notification v-else-if="!allImagesUploaded" type="error">
              {{ $t('nft.validation.imagesInvalid') }} {{ imagesNames }}
            </Notification>
          </div>
          <Btn
            type="secondary"
            size="large"
            :disabled="!collectionStore.hasImages || !allImagesUploaded"
            @click="collectionStore.stepUpload = NftUploadStep.PREVIEW"
          >
            {{ $t('nft.upload.previewNfts') }}
          </Btn>
        </n-space>
      </template>

      <!-- Upload/Confirm CSV -->
      <template v-else>
        <h2>{{ $t('nft.upload.csvFile') }}</h2>
        <p class="text-body whitespace-pre-line">
          {{ $t('nft.upload.infoFile') }}
        </p>
        <p class="mb-6 text-body whitespace-pre-line">
          <NuxtLink href="https://wiki.apillon.io/build/3-apillon-api.html" target="_blank">
            <Btn type="builders" size="tiny">
              <span class="inline-block leading-6 text-primary hover:text-bg-dark">
                {{ $t('general.learnMore') }}
              </span>
            </Btn>
          </NuxtLink>
          <span class="inline-block mx-1">{{ $t('general.or') }}</span>
          <NuxtLink href="/files/example.csv" target="_blank">
            <Btn type="builders" size="tiny">
              <span class="inline-block leading-6 text-primary hover:text-bg-dark">
                {{ $t('nft.upload.downloadCsv') }}
              </span>
            </Btn>
          </NuxtLink>
        </p>
        <n-upload
          v-if="!collectionStore.hasCsvFile"
          :show-file-list="false"
          accept=".csv, application/vnd.ms-excel"
          :custom-request="uploadFileRequest"
        >
          <n-upload-dragger class="h-40">
            <div class="py-2 text-center">
              <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
                <span class="icon-upload text-violet text-2xl"></span>
              </div>

              <h4 class="mb-1">{{ $t('nft.upload.csvFile') }}</h4>
              <span class="text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
            </div>
          </n-upload-dragger>
        </n-upload>
        <div v-else class="flex text-left">
          <div class="flex-1 px-4 py-2 border-1 border-bg-lighter">
            <span class="icon-file text-xl align-sub mr-3"></span>
            <span>{{ collectionStore.csvFile.name }}</span>
          </div>
          <div class="">
            <button
              class="flex justify-center items-center h-12 w-12 ml-4 p-3"
              @click="collectionStore.resetFile()"
            >
              <span class="icon-delete text-xl"></span>
            </button>
          </div>
        </div>

        <Btn
          class="mt-10"
          size="large"
          type="secondary"
          :disabled="!collectionStore.hasCsvFile || !hasRequiredMetadata"
          @click="modalMetadataAttributesVisible = true"
        >
          {{ $t('form.proceed') }}
        </Btn>
      </template>
    </div>

    <modal v-model:show="modalMetadataAttributesVisible" :title="$t('nft.upload.attributes')">
      <n-space class="pb-8" :size="32" vertical>
        <NftMetadataAttributes />
        <Btn class="float-right" type="primary" @click="createMetadata">
          {{ $t('nft.upload.csvConfirmAttributes') }}
        </Btn>
      </n-space>
    </modal>
  </div>
</template>

<script lang="ts" setup>
const collectionStore = useCollectionStore();
const {
  allImagesUploaded,
  hasRequiredMetadata,
  imagesNames,
  missingImages,
  createNftData,
  createThumbnailUrl,
  uploadFileRequest,
  parseUploadedFile,
  handleImageChange,
  handleImageRemove,
  uploadImagesRequest,
} = useNft();

const modalMetadataAttributesVisible = ref<boolean>(false);

onMounted(() => {
  if (!!collectionStore.csvFile?.file && !collectionStore.csvData) {
    parseUploadedFile(collectionStore.csvFile.file);
  }
});

function isStepAvailable(step: number) {
  if (step === NftUploadStep.PREVIEW) {
    return (
      collectionStore.hasImages && allImagesUploaded.value && isStepAvailable(NftUploadStep.IMAGES)
    );
  } else if (step === NftUploadStep.IMAGES) {
    return collectionStore.hasCsvFile && collectionStore.hasMetadata;
  }
  return true;
}

function createMetadata() {
  collectionStore.metadata = createNftData();
  collectionStore.stepUpload = NftUploadStep.IMAGES;
  modalMetadataAttributesVisible.value = false;
}

// async function deploy() {
//   loading.value = true;
//   await deployCollection();
//   loading.value = false;
// }
</script>
