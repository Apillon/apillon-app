<template>
  <div class="flex h-full flex-col gap-x-12 md:flex-row">
    <div class="md:w-1/2">
      <!-- Upload/Confirm CSV -->
      <h4>{{ $t('nft.upload.titleCsv') }}</h4>
      <p class="mb-6">
        {{ $t('nft.upload.infoFile') }}
      </p>

      <h6>{{ $t('nft.step', { step: 1 }) }}</h6>
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
        v-if="!metadataStore.hasCsvFile"
        :show-file-list="false"
        accept=".csv, application/vnd.ms-excel"
        :input-props="{ id: 'csvFile' }"
        :custom-request="e => onCsvFileUpload(e)"
      >
        <Btn size="small" type="secondary">
          {{ $t('nft.upload.csvFile') }}
        </Btn>
      </n-upload>
      <template v-else>
        <div class="flex">
          <div class="card flex h-9 flex-1 items-center gap-2 rounded-lg px-4 py-2 text-xs">
            <IconSuccess v-if="hasRequiredMetadata" />
            <strong>{{ metadataStore.csvFile.name }}</strong>
          </div>
          <button class="ml-4 flex h-9 w-9 items-center justify-center p-3" @click="metadataStore.resetFile()">
            <span class="icon-delete text-xl"></span>
          </button>
        </div>
        <Notification v-if="!hasRequiredMetadata" type="error" class="mt-4">
          {{ $t('nft.validation.fileInvalid') }}
        </Notification>
      </template>

      <!-- Upload Img -->
      <template v-if="metadataStore.hasCsvFile && hasRequiredMetadata">
        <h6 class="mt-6">{{ $t('nft.step', { step: 2 }) }}</h6>
        <p class="mb-6">
          {{ $t('nft.upload.infoImages') }}
        </p>
        <FormFieldUploadImage
          v-if="!allImagesUploaded"
          ref="uploadRef"
          :file-list="metadataStore.images"
          multiple
          directory-dnd
          @change="upload => uploadImageRequest(upload, !isUnique)"
          @remove="handleImageRemove"
        />
        <div v-if="metadataStore.hasImages" class="mt-5 flex">
          <div class="card flex h-9 flex-1 items-center gap-2 rounded-lg px-4 py-2 text-xs">
            <IconSuccess v-if="allImagesUploaded" />
            <strong>{{ metadataStore.images.length }}</strong>
            <strong>{{ $t('general.images') }}</strong>
          </div>
          <button class="ml-4 flex h-9 w-9 items-center justify-center p-3" @click="removeImages()">
            <span class="icon-delete text-xl"></span>
          </button>
        </div>

        <n-space class="mb-8 mt-5" :size="20" justify="space-between" vertical>
          <Notification v-if="loadingImages" type="info" class="overflow-hidden">
            {{ $t('storage.file.uploading') }}: ({{ metadataStore.images.length }}/{{ dataImagesNames.length }})
          </Notification>
          <Notification v-else-if="metadataStore.hasImages && !allImagesUploaded" type="error" class="overflow-hidden">
            {{ $t('nft.validation.imagesMissing') }} {{ missingImages }}
          </Notification>
        </n-space>
      </template>
    </div>
    <div class="relative hidden h-full md:block">
      <div class="absolute bottom-8 top-8 border-l border-bg-lighter"></div>
    </div>
    <div class="md:w-1/2">
      <template v-if="metadataStore.hasCsvFile && hasRequiredMetadata && allImagesUploaded">
        <h6>{{ $t('nft.upload.attributes') }}</h6>
        <p class="mb-4">
          {{ $t('nft.upload.attributesInfo') }}
        </p>
        <NftMetadataAttributes />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UploadCustomRequestOptions, UploadInst } from 'naive-ui';

const metadataStore = useMetadataStore();
const { isUnique } = useCollection();
const {
  allImagesUploaded,
  dataImagesNames,
  hasRequiredMetadata,
  loadingImages,
  missingImages,
  handleImageRemove,
  parseUploadedFile,
  uploadFileRequest,
  uploadImageRequest,
} = useMetadata();

const uploadRef = ref<UploadInst | null>(null);

onMounted(() => {
  if (!!metadataStore.csvFile?.file && !metadataStore.csvData) {
    parseUploadedFile(metadataStore.csvFile.file);
  }
});

function onCsvFileUpload(event: UploadCustomRequestOptions) {
  removeImages();
  uploadFileRequest(event);
}

function removeImages() {
  metadataStore.resetImages();
  uploadRef.value?.clear();
}
</script>
