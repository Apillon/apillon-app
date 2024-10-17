<template>
  <!-- MARK: this is a placeholder, need to implement logic, variables for collection logo and cover -->
  <div class="w-full min-w-[10rem]">
    <div v-if="collectionStore.form.base.coverImage?.id" class="mx-auto w-72 overflow-hidden rounded-xl bg-bg-light">
      <figure class="flex h-full flex-col">
        <Image
          :src="createThumbnailUrl(collectionStore.form.base.coverImage)"
          class="h-full w-full object-contain"
          :alt="collectionStore.form.base.coverImage.name"
        />
        <figcaption class="block h-12 px-4 py-3 font-bold">
          {{ collectionStore.form.base.coverImage.name }}
          <button class="float-right flex items-center justify-center p-1" @click="handleCoverImageRemove()">
            <span class="icon-delete text-xl"></span>
          </button>
        </figcaption>
      </figure>
    </div>
    <n-upload
      v-else
      ref="uploadRef"
      accept="image/png, image/jpeg"
      :show-file-list="false"
      :custom-request="e => onLogoUploaded(e, false)"
      @change="onUploadChange"
      @remove="handleCoverImageRemove"
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
  </div>
</template>

<script setup lang="ts">
import type { UploadCustomRequestOptions } from 'naive-ui';

defineProps({
  isLogo: { type: Boolean, default: false },
});

const collectionStore = useCollectionStore();
const collection = useCollection();
const { createThumbnailUrl } = useNft();

function onLogoUploaded(event: UploadCustomRequestOptions, logo: boolean) {
  collection.uploadFileRequest(event, logo);
}

function onUploadLogoChange(options: FileUploadOptions) {
  const uploadFile = {
    file: options.file,
    onProgress: () => {},
    onFinish: collectionStore.form.base.logo?.onFinish || (() => {}),
    onError: collectionStore.form.base.logo?.onError || (() => {}),
  } as UploadCustomRequestOptions;

  handleLogoRemove();
  collection.uploadFileRequest(uploadFile, true);
}

function onUploadChange(options: FileUploadOptions) {
  const uploadFile = {
    file: options.file,
    onProgress: () => {},
    onFinish: collectionStore.form.base.coverImage?.onFinish || (() => {}),
    onError: collectionStore.form.base.coverImage?.onError || (() => {}),
  } as UploadCustomRequestOptions;

  handleCoverImageRemove();
  collection.uploadFileRequest(uploadFile, false);
}

function handleCoverImageRemove() {
  collectionStore.form.base.coverImage = null;
}

function handleLogoRemove() {
  collectionStore.form.base.logo = null;
}
</script>
