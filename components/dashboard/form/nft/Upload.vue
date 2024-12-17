<template>
  <div v-bind="$attrs" class="flex items-center justify-center">
    <div
      class="w-full text-center"
      :class="collectionStore.stepUpload === NftUploadStep.PREVIEW ? 'self-start' : 'max-w-lg'"
    >
      <!-- Upload Img -->
      <template v-if="collectionStore.stepUpload === NftUploadStep.IMAGES">
        <h2>{{ $t('nft.upload.titleImage') }}</h2>
        <p class="whitespace-pre-line text-body">
          {{ $t('nft.upload.infoImages') }}
        </p>
        <p class="mb-6">
          <Btn type="builders" size="tiny" href="https://wiki.apillon.io/web3-services/4-nfts.html">
            {{ $t('general.learnMore') }}
          </Btn>
        </p>
        <n-upload
          ref="uploadRef"
          v-on-click-outside="stopLoader"
          accept="image/*"
          :default-file-list="collectionStore.images"
          :show-file-list="false"
          :max="nft.dataImagesNames.value.length"
          multiple
          directory-dnd
          :custom-request="upload => nft.uploadImagesRequest(upload, !isUnique)"
          @change="onUploadChange"
          @remove="nft.handleImageRemove"
          @click="startLoader"
          @click-outside="nft.loadingImages.value = false"
        >
          <n-upload-dragger class="h-40">
            <div class="py-2 text-center">
              <div class="mb-2 inline-block h-10 w-10 rounded-full bg-bg-lighter p-2">
                <span class="icon-image text-2xl text-violet"></span>
              </div>

              <h4 class="mb-1">{{ $t('nft.upload.images') }}</h4>
              <span class="text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
            </div>
          </n-upload-dragger>
        </n-upload>
        <div v-if="collectionStore.hasImages" class="mt-5 flex text-left">
          <div class="card w-full px-4 py-[10px]">
            <span class="icon-image mr-3 align-sub text-xl"></span>
            <span>{{ collectionStore.images.length }}</span>
            &nbsp;
            <span>{{ $t('general.images') }}</span>
          </div>
          <div class="">
            <button class="ml-4 flex h-12 w-12 items-center justify-center p-3" @click="removeImages()">
              <span class="icon-delete text-xl"></span>
            </button>
          </div>
        </div>

        <n-space class="mb-8 mt-5" :size="20" justify="space-between" vertical>
          <Notification
            v-if="collectionStore.hasImages && !nft.allImagesUploaded.value"
            type="error"
            class="overflow-hidden"
          >
            {{ $t('nft.validation.imagesMissing') }} {{ nft.missingImages }}
          </Notification>
          <Btn
            type="primary"
            size="large"
            :loading="nft.loadingImages.value"
            :disabled="!collectionStore.hasImages || !nft.allImagesUploaded.value"
            @click="goToPreview"
          >
            {{ $t('nft.upload.previewNfts') }}
          </Btn>
        </n-space>
      </template>

      <template v-else-if="collectionStore.stepUpload === NftUploadStep.ATTRIBUTES">
        <h2>{{ $t('nft.upload.attributes') }}</h2>
        <p class="whitespace-pre-line text-body">
          {{ $t('nft.upload.attributesInfo') }}
        </p>
        <NftMetadataAttributes class="mb-8" />
        <div class="-ml-2 flex items-center justify-between gap-4 px-2">
          <Btn type="secondary" class="w-1/2" @click="collectionStore.stepUpload = NftUploadStep.FILE">
            {{ $t('form.goBack') }}
          </Btn>
          <Btn class="w-1/2" @click="createMetadata">
            {{ $t('nft.upload.csvConfirmAttributes') }}
          </Btn>
        </div>
      </template>

      <!-- Upload/Confirm CSV -->
      <template v-else>
        <h2>{{ $t('nft.upload.titleCsv') }}</h2>
        <p class="whitespace-pre-line text-body">
          {{ $t('nft.upload.infoFile') }}
        </p>
        <p class="mb-6 whitespace-pre-line text-body">
          <Btn type="builders" size="tiny" href="https://wiki.apillon.io/web3-services/4-nfts.html">
            {{ $t('general.learnMore') }}
          </Btn>
          <span class="mx-1 inline-block">{{ $t('general.or') }}</span>
          <Btn type="builders" size="tiny" href="/files/example.csv">
            {{ $t('nft.upload.downloadCsv') }}
          </Btn>
        </p>
        <div v-if="!collectionStore.hasCsvFile" class="flex">
          <n-upload
            v-if="!collectionStore.hasCsvFile"
            :show-file-list="false"
            accept=".csv, application/vnd.ms-excel"
            class="w-full"
            :custom-request="e => onCsvFileUpload(e)"
          >
            <Btn class="w-full" type="secondary">
              {{ $t('nft.upload.csvFile') }}
            </Btn>
          </n-upload>
          <IconInfo :tooltip="$t('form.label.collection.labelInfo.csvUpload')" size="lg" />
        </div>
        <template v-else>
          <div class="flex text-left">
            <div class="card flex-1 rounded-lg px-4 py-2">
              <span class="icon-file mr-3 align-sub text-xl"></span>
              <span>{{ collectionStore.csvFile.name }}</span>
            </div>
            <div class="">
              <button class="ml-4 flex h-12 w-12 items-center justify-center p-3" @click="collectionStore.resetFile()">
                <span class="icon-delete text-xl"></span>
              </button>
            </div>
          </div>
          <Notification v-if="!nft.hasRequiredMetadata.value" type="error" class="mt-4 text-left">
            {{ $t('nft.validation.fileInvalid') }}
          </Notification>
        </template>

        <Btn
          class="mb-8 mt-10"
          size="large"
          type="primary"
          :disabled="!collectionStore.hasCsvFile || !nft.hasRequiredMetadata.value"
          @click="openAttributes"
        >
          {{ $t('form.proceed') }}
        </Btn>
      </template>
    </div>

    <Modal v-model:show="modalMetadataAttributesVisible" :title="$t('nft.upload.attributes')">
      <div class="-mt-4">
        <p class="mb-2 whitespace-pre-line text-body">
          {{ $t('nft.upload.attributesInfo') }}
        </p>
        <NftMetadataAttributes />
        <Btn class="float-right" type="primary" @click="createMetadata">
          {{ $t('nft.upload.csvConfirmAttributes') }}
        </Btn>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { vOnClickOutside } from '@vueuse/components';
import type { UploadCustomRequestOptions, UploadInst } from 'naive-ui';
import { NftCreateStep, NftUploadStep } from '~/lib/types/nft';

const props = defineProps({
  modal: { type: Boolean, default: false },
});

const nft = useNft();
const collectionStore = useCollectionStore();
const { isUnique, openAddNft } = useCollection();

const uploadRef = ref<UploadInst | null>(null);
const modalMetadataAttributesVisible = ref<boolean>(false);

onMounted(() => {
  if (!!collectionStore.csvFile?.file && !collectionStore.csvData) {
    nft.parseUploadedFile(collectionStore.csvFile.file);
  }
});

function openAttributes() {
  if (props.modal) {
    collectionStore.stepUpload = NftUploadStep.ATTRIBUTES;
  } else {
    modalMetadataAttributesVisible.value = true;
  }
}

function goToPreview() {
  if (props.modal) {
    openAddNft(collectionStore.active.collection_uuid);
  }
  collectionStore.nftStep = NftCreateStep.PREVIEW;
}

function createMetadata() {
  collectionStore.metadata = nft.createNftData();
  collectionStore.stepUpload = NftUploadStep.IMAGES;
  modalMetadataAttributesVisible.value = false;
}

function startLoader() {
  if ((collectionStore.csvData?.length || 0) > nft.dataImagesNames.value.length) {
    nft.loadingImages.value = true;
  }
}

function stopLoader() {
  nft.loadingImages.value = false;
}

function onCsvFileUpload(event: UploadCustomRequestOptions) {
  removeImages();
  nft.uploadFileRequest(event);
}

function onUploadChange(options: FileUploadOptions) {
  nft.handleImageChange(options);
  startLoader();
}

function removeImages() {
  collectionStore.resetImages();
  uploadRef.value?.clear();
}
</script>
