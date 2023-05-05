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
        <NftPreview>
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
        </NftPreview>
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
              {{ $t('general.learnMore') }}
            </Btn>
          </NuxtLink>
        </p>
        <n-upload
          v-if="!collectionStore.hasImages"
          v-on-click-outside="stopLoader"
          accept="image/png, image/jpeg"
          :default-file-list="collectionStore.images"
          :show-file-list="false"
          :max="collectionStore.csvData?.length || undefined"
          multiple
          directory-dnd
          :custom-request="uploadImagesRequest"
          @click="loadingImages = true"
          @click-outside="loadingImages = false"
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
            v-on-click-outside="stopLoader"
            accept="image/png, image/jpeg"
            class="flex-1 w-full cursor-pointer"
            :show-file-list="false"
            :max="collectionStore.csvData?.length || undefined"
            multiple
            directory-dnd
            :custom-request="uploadImagesRequest"
            @change="handleImageChange"
            @remove="handleImageRemove"
            @click="loadingImages = true"
          >
            <div class="card px-4 py-2">
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
            <Notification v-else-if="!allImagesUploaded" type="error" class="overflow-hidden">
              {{ $t('nft.validation.imagesInvalid') }} {{ imagesNames }}
            </Notification>
          </div>
          <Btn
            type="secondary"
            size="large"
            :loading="loadingImages"
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
              {{ $t('general.learnMore') }}
            </Btn>
          </NuxtLink>
          <span class="inline-block mx-1">{{ $t('general.or') }}</span>
          <NuxtLink href="/files/example.csv" target="_blank">
            <Btn type="builders" size="tiny">
              {{ $t('nft.upload.downloadCsv') }}
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
        <template v-else>
          <div class="flex text-left">
            <div class="card flex-1 px-4 py-2">
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
          <Notification v-if="!hasRequiredMetadata" type="error" class="mt-4 text-left">
            {{ $t('nft.validation.fileInvalid') }}
          </Notification>
        </template>

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
import { vOnClickOutside } from '@vueuse/components';

const collectionStore = useCollectionStore();
const {
  allImagesUploaded,
  hasRequiredMetadata,
  imagesNames,
  loadingImages,
  missingImages,
  createNftData,
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

function stopLoader() {
  loadingImages.value = false;
}
</script>
