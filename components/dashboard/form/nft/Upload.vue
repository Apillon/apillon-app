<template>
  <div class="flex h-full flex-col gap-x-12 md:flex-row">
    <div class="md:w-1/2">
      <!-- Upload/Confirm CSV -->
      <h4>{{ $t('nft.upload.titleCsv') }}</h4>
      <p class="mb-6">
        {{ $t('nft.upload.infoFile') }}
      </p>

      <strong class="text-sm">{{ $t('nft.step', { step: 1 }) }}</strong>
      <p class="mb-6">
        <span class="mr-1 inline-block">{{ $t('nft.upload.csvHelp') }}</span>
        <Btn type="link" href="/files/example.csv">
          {{ $t('nft.upload.downloadCsv') }}
        </Btn>
        <span class="mx-1 inline-block">{{ $t('general.or') }}</span>
        <Btn type="link" href="https://wiki.apillon.io/web3-services/4-nfts.html">
          {{ $t('general.learnMore') }}
        </Btn>
      </p>
      <n-upload
        v-if="!collectionStore.hasCsvFile"
        :show-file-list="false"
        accept=".csv, application/vnd.ms-excel"
        :input-props="{ id: 'csvFile' }"
        :custom-request="e => onCsvFileUpload(e)"
      >
        <Btn type="secondary">
          {{ $t('nft.upload.csvFile') }}
        </Btn>
      </n-upload>
      <template v-else>
        <div class="flex">
          <div class="card flex h-9 flex-1 items-center gap-2 rounded-lg px-4 py-2 text-xs">
            <IconSuccess />
            <strong>{{ collectionStore.csvFile.name }}</strong>
          </div>
          <button class="ml-4 flex h-9 w-9 items-center justify-center p-3" @click="collectionStore.resetFile()">
            <span class="icon-delete text-xl"></span>
          </button>
        </div>
        <Notification v-if="!hasRequiredMetadata" type="error" class="mt-4">
          {{ $t('nft.validation.fileInvalid') }}
        </Notification>
      </template>

      <!-- Upload Img -->
      <template v-if="collectionStore.hasCsvFile && hasRequiredMetadata">
        <strong class="mt-6 inline-block">{{ $t('nft.step', { step: 2 }) }}</strong>
        <p class="mb-6 mt-2">
          {{ $t('nft.upload.infoImages') }}
        </p>
        <n-upload
          v-if="!allImagesUploaded"
          ref="uploadRef"
          accept="image/*"
          :file-list="collectionStore.images"
          :show-file-list="false"
          multiple
          directory-dnd
          @change="upload => uploadImageRequest(upload, !isUnique)"
          @remove="handleImageRemove"
        >
          <n-upload-dragger class="h-40">
            <div class="py-2 text-center">
              <div class="mb-2 inline-block h-10 w-10 rounded-full bg-bg-lighter p-2">
                <span class="icon-image text-2xl text-violet"></span>
              </div>

              <strong class="mb-1 block">{{ $t('nft.upload.images') }}</strong>
              <span class="text-white-terciary">{{ $t('nft.upload.dragAndDrop') }}</span>
            </div>
          </n-upload-dragger>
        </n-upload>
        <div v-if="collectionStore.hasImages" class="mt-5 flex">
          <div class="card flex h-9 flex-1 items-center gap-2 rounded-lg px-4 py-2 text-xs">
            <IconSuccess v-if="allImagesUploaded" />
            <strong>{{ collectionStore.images.length }}</strong>
            <strong>{{ $t('general.images') }}</strong>
          </div>
          <button class="ml-4 flex h-9 w-9 items-center justify-center p-3" @click="removeImages()">
            <span class="icon-delete text-xl"></span>
          </button>
        </div>

        <n-space class="mb-8 mt-5" :size="20" justify="space-between" vertical>
          <Notification v-if="loadingImages" type="info" class="overflow-hidden">
            {{ $t('storage.file.uploading') }}: ({{ collectionStore.images.length }}/{{ dataImagesNames.length }})
          </Notification>
          <Notification
            v-else-if="collectionStore.hasImages && !allImagesUploaded"
            type="error"
            class="overflow-hidden"
          >
            {{ $t('nft.validation.imagesMissing') }} {{ missingImages }}
          </Notification>
        </n-space>
      </template>
    </div>
    <div class="relative h-full">
      <div class="absolute bottom-8 top-8 border-l border-bg-lighter"></div>
    </div>
    <div class="md:w-1/2">
      <div v-if="collectionStore.hasCsvFile && hasRequiredMetadata && allImagesUploaded" class="">
        <h4>{{ $t('nft.upload.attributes') }}</h4>
        <p class="mb-2">
          {{ $t('nft.upload.attributesInfo') }}
        </p>
        <NftMetadataAttributes />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UploadCustomRequestOptions, UploadInst } from 'naive-ui';
import { NftCreateStep, NftUploadStep } from '~/lib/types/nft';

const props = defineProps({
  modal: { type: Boolean, default: false },
});

const collectionStore = useCollectionStore();
const { isUnique, openAddNft } = useCollection();
const {
  allImagesUploaded,
  dataImagesNames,
  hasRequiredMetadata,
  loadingImages,
  missingImages,
  createNftData,
  handleImageRemove,
  parseUploadedFile,
  uploadFileRequest,
  uploadImageRequest,
} = useNft();

const uploadRef = ref<UploadInst | null>(null);
const modalMetadataAttributesVisible = ref<boolean>(false);

onMounted(() => {
  if (!!collectionStore.csvFile?.file && !collectionStore.csvData) {
    parseUploadedFile(collectionStore.csvFile.file);
  }
});

function goToPreview() {
  if (props.modal) {
    openAddNft(collectionStore.active.collection_uuid);
  }
  collectionStore.nftStep = NftCreateStep.PREVIEW;
}

function createMetadata() {
  collectionStore.metadata = createNftData();
  collectionStore.stepUpload = NftUploadStep.IMAGES;
  modalMetadataAttributesVisible.value = false;
}

function startLoader() {
  if (
    (collectionStore.csvData?.length || 0) > dataImagesNames.value.length ||
    collectionStore.images.length < dataImagesNames.value.length
  ) {
    loadingImages.value = true;
  }
}

function onCsvFileUpload(event: UploadCustomRequestOptions) {
  removeImages();
  uploadFileRequest(event);
}

function removeImages() {
  collectionStore.resetImages();
  uploadRef.value?.clear();
}
</script>
