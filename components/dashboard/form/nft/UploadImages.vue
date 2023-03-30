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
      :custom-request="uploadImagesRequest"
      @change="handleChange"
      @remove="handleRemove"
    />
    <n-upload
      v-else
      accept="image/png, image/jpeg"
      :default-file-list="collectionStore.images"
      :show-file-list="false"
      :max="collectionStore.csvData?.length || undefined"
      multiple
      directory-dnd
      :custom-request="uploadImagesRequest"
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
          {{ $t('nft.validation.imagesMissing') }} {{ missingImages }}
        </Notification>
        <Notification v-else-if="!allImagesUploaded" type="error">
          {{ $t('nft.validation.imagesInvalid') }} {{ imagesNames }}
        </Notification>
      </div>
      <Btn
        v-if="collectionStore.hasImages"
        type="primary"
        :disabled="!allImagesUploaded"
        @click="collectionStore.mintTab = NftMintTab.MINT"
      >
        {{ $t('nft.upload.imagesConfirm') }}
      </Btn>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();
const { fileAlreadyOnFileList } = useUpload();
const { allImagesUploaded } = useNft();

const missingImages = computed<string>(() => {
  if (collectionStore.csvData.length - collectionStore.images.length > 5) {
    return '(' + collectionStore.images.length + '/' + collectionStore.csvData.length + ')';
  }
  const uploadedImagesNames = collectionStore.images.map(img => img.name);
  return collectionStore.csvData
    .filter(item => !uploadedImagesNames.includes(item.image))
    .map(item => item.image)
    .join(', ');
});

const imagesNames = computed<string>(() => {
  return collectionStore.csvData
    .map(item => {
      return item.image;
    })
    .join(',');
});

/** Upload file request - add file to list */
function uploadImagesRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  if (!isImage(file.type)) {
    message.warning($i18n.t('validation.notImage', { name: file.name }));
    return;
  }

  const image = {
    ...file,
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
    onFinish,
    onError,
  };

  if (!fileAlreadyOnFileList(collectionStore.images, image)) {
    collectionStore.images.push(image);
  }
}

function handleChange(options: {
  file: NUploadFileInfo;
  fileList: NUploadFileInfo[];
  event?: Event;
}) {
  const index = options.fileList.indexOf(options.file);
  const indexImage = collectionStore.images.findIndex(
    item => item.name === options.file.name && item.fullPath === options.file.fullPath
  );

  if (!isImage(options.file.type)) {
    options.fileList.splice(index, 1);
    message.warning($i18n.t('validation.notImage', { name: options.file.name }));
  } else if (indexImage !== -1) {
    options.fileList.splice(index, 1);
    if (!allImagesUploaded.value) {
      message.warning($i18n.t('validation.alreadyOnList', { name: options.file.name }));
    }
  }
}

function handleRemove(data: { file: NUploadFileInfo; fileList: NUploadFileInfo[] }) {
  collectionStore.images = collectionStore.images.filter(item => item.id !== data.file.id);
}

function isImage(type: string | null = '') {
  if (!type) return false;
  return type.includes('image/');
}
</script>
