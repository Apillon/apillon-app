<template>
  <div class="flex justify-center items-center" style="min-height: calc(100dvh - 300px)">
    <div
      class="w-full text-center"
      :class="collectionStore.stepUpload === NftUploadStep.PREVIEW ? 'self-start' : 'max-w-lg'"
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
            {{ $t('nft.upload.previewConfirm') }}
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
        <h2>{{ $t('nft.upload.titleImage') }}</h2>
        <p class="text-body whitespace-pre-line">
          {{ $t('nft.upload.infoImages') }}
        </p>
        <p class="mb-6">
          <Btn type="builders" size="tiny" href="https://wiki.apillon.io/web3-services/4-nfts.html">
            {{ $t('general.learnMore') }}
          </Btn>
        </p>
        <n-upload
          v-on-click-outside="stopLoader"
          accept="image/png, image/jpeg"
          :default-file-list="collectionStore.images"
          :show-file-list="false"
          :max="collectionStore.images.length > 0 ? collectionStore.csvData?.length : undefined"
          multiple
          directory-dnd
          :custom-request="nft.uploadImagesRequest"
          @change="onUploadChange"
          @remove="nft.handleImageRemove"
          @click="startLoader"
          @click-outside="nft.loadingImages.value = false"
        >
          <n-upload-dragger class="h-40">
            <div class="py-2 text-center">
              <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
                <span class="icon-image text-violet text-2xl"></span>
              </div>

              <h4 class="mb-1">{{ $t('nft.upload.images') }}</h4>
              <span class="text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
            </div>
          </n-upload-dragger>
        </n-upload>
        <div v-if="collectionStore.hasImages" class="flex mt-5 text-left">
          <div class="card w-full px-4 py-2">
            <span class="icon-image text-xl align-sub mr-3"></span>
            <span>{{ collectionStore.images.length }}</span>
            &nbsp;
            <span>{{ $t('general.images') }}</span>
          </div>
          <div class="">
            <button
              class="flex justify-center items-center h-12 w-12 ml-4 p-3"
              @click="collectionStore.resetImages()"
            >
              <span class="icon-delete text-xl"></span>
            </button>
          </div>
        </div>

        <n-space class="mt-5 mb-8" :size="20" justify="space-between" vertical>
          <Notification v-if="!nft.allImagesUploaded.value" type="error" class="overflow-hidden">
            {{ $t('nft.validation.imagesMissing') }} {{ nft.missingImages }}
          </Notification>
          <Btn
            type="primary"
            size="large"
            :loading="nft.loadingImages.value"
            :disabled="!collectionStore.hasImages || !nft.allImagesUploaded.value"
            @click="collectionStore.stepUpload = NftUploadStep.PREVIEW"
          >
            {{ $t('nft.upload.previewNfts') }}
          </Btn>
        </n-space>
      </template>

      <!-- Upload/Confirm CSV -->
      <template v-else>
        <h2>{{ $t('nft.upload.titleCsv') }}</h2>
        <p class="text-body whitespace-pre-line">
          {{ $t('nft.upload.infoFile') }}
        </p>
        <p class="mb-6 text-body whitespace-pre-line">
          <Btn type="builders" size="tiny" href="https://wiki.apillon.io/web3-services/4-nfts.html">
            {{ $t('general.learnMore') }}
          </Btn>
          <span class="inline-block mx-1">{{ $t('general.or') }}</span>
          <Btn type="builders" size="tiny" href="/files/example.csv">
            {{ $t('nft.upload.downloadCsv') }}
          </Btn>
        </p>
        <n-upload
          v-if="!collectionStore.hasCsvFile"
          :show-file-list="false"
          accept=".csv, application/vnd.ms-excel"
          class="w-full"
          :custom-request="nft.uploadFileRequest"
        >
          <Btn class="w-full" type="secondary">
            {{ $t('nft.upload.csvFile') }}
          </Btn>
          <!--
          <n-upload-dragger class="h-40">
            <div class="py-2 text-center">
              <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
                <span class="icon-upload text-violet text-2xl"></span>
              </div>

              <h4 class="mb-1">{{ $t('nft.upload.csvFile') }}</h4>
              <span class="text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
            </div>
          </n-upload-dragger>
        -->
        </n-upload>
        <template v-else>
          <div class="flex text-left">
            <div class="card flex-1 px-4 py-2 rounded-lg">
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
          <Notification v-if="!nft.hasRequiredMetadata.value" type="error" class="mt-4 text-left">
            {{ $t('nft.validation.fileInvalid') }}
          </Notification>
        </template>

        <Btn
          class="mt-10 mb-8"
          size="large"
          type="primary"
          :disabled="!collectionStore.hasCsvFile || !nft.hasRequiredMetadata.value"
          @click="modalMetadataAttributesVisible = true"
        >
          {{ $t('form.proceed') }}
        </Btn>
      </template>
    </div>

    <modal v-model:show="modalMetadataAttributesVisible" :title="$t('nft.upload.attributes')">
      <n-space :size="32" vertical>
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
const nft = useNft();

const modalMetadataAttributesVisible = ref<boolean>(false);

onMounted(() => {
  if (!!collectionStore.csvFile?.file && !collectionStore.csvData) {
    nft.parseUploadedFile(collectionStore.csvFile.file);
  }
});

function isStepAvailable(step: number) {
  if (step === NftUploadStep.PREVIEW) {
    return (
      collectionStore.hasImages &&
      nft.allImagesUploaded.value &&
      isStepAvailable(NftUploadStep.IMAGES)
    );
  } else if (step === NftUploadStep.IMAGES) {
    return collectionStore.hasCsvFile && collectionStore.hasMetadata;
  }
  return true;
}

function createMetadata() {
  collectionStore.metadata = nft.createNftData();
  collectionStore.stepUpload = NftUploadStep.IMAGES;
  modalMetadataAttributesVisible.value = false;
}

function startLoader() {
  if ((collectionStore.csvData?.length || 0) > collectionStore.images.length) {
    nft.loadingImages.value = true;
  }
}

function stopLoader() {
  nft.loadingImages.value = false;
}

function onUploadChange(options: FileUploadOptions) {
  nft.handleImageChange(options);
  startLoader();
}
</script>
