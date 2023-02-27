<template>
  <n-upload
    v-if="collectionStore.hasImages"
    ref="NUploadRef"
    :default-file-list="collectionStore.images"
    :show-preview-button="false"
    :show-remove-button="false"
    :show-retry-button="false"
    list-type="image-card"
    multiple
    directory-dnd
    :custom-request="uploadImagesRequest"
    @change="handleChange"
    @remove="handleRemove"
  >
  </n-upload>
  <n-upload
    v-else
    :default-file-list="collectionStore.images"
    :show-file-list="false"
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
  <Btn
    v-if="collectionStore.hasImages"
    type="primary"
    @click="collectionStore.mintTab = NftMintTab.MINT"
  >
    {{ $t('nft.upload.imagesConfirm') }}
  </Btn>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const message = useMessage();
const collectionStore = useCollectionStore();
const { fileAlreadyOnFileList } = useUpload();

/** Upload file request - add file to list */
function uploadImagesRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  if (!isImage(file.type)) {
    message.warning(file.name + ' is not an image');
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
  var index = options.fileList.indexOf(options.file);
  var indexImage = collectionStore.images.findIndex(
    item => item.name === options.file.name && item.fullPath === options.file.fullPath
  );

  if (!isImage(options.file.type)) {
    options.fileList.splice(index, 1);
    message.warning(options.file.name + ' is not an image');
  } else if (indexImage !== -1) {
    options.fileList.splice(index, 1);
    message.warning(options.file.name + ' is already on list');
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
