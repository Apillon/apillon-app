<template>
  <!-- MARK: this is a placeholder, need to implement logic, variables for collection logo and cover -->
  <div class="w-full">
    <div v-if="isLogo">
      <div class="flex gap-8">
        <div class="w-32 h-32 min-w-[8rem]">
          <Image
            v-if="collectionStore.form.base.logo?.id"
            :src="createThumbnailUrl(collectionStore.form.base.logo)"
            class="w-full h-full object-contain"
          />
          <n-upload
            v-else
            ref="uploadRef"
            accept="image/png, image/jpeg"
            :show-file-list="false"
            :custom-request="e => onLogoUploaded(e, true)"
            @change="onUploadLogoChange"
            @remove="collection.handleLogoRemove"
          >
            <n-upload-dragger>
              <div class="w-24 h-20 flex-cc flex-col">
                <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
                  <span class="icon-image text-violet text-2xl"></span>
                </div>

                <h6 class="text-xs">{{ $t('nft.upload.logo') }}</h6>
              </div>
            </n-upload-dragger>
          </n-upload>
        </div>
        <div class="flex-auto">
          <n-upload
            v-if="!collectionStore.form.base.logo?.id"
            class="w-full"
            accept="image/png, image/jpeg"
            :show-file-list="false"
            :custom-request="e => onLogoUploaded(e, true)"
          >
            <Btn class="w-full" type="secondary"> {{ $t('nft.collection.addLogo') }} </Btn>
          </n-upload>
          <template v-else>
            <div class="flex text-left">
              <div class="h-12 card flex-1 px-4 py-[10px] rounded-lg">
                <span class="icon-file text-xl align-sub mr-3"></span>
                <span>{{ collectionStore.form.base.logo.name }}</span>
              </div>
              <div>
                <button
                  class="flex justify-center items-center h-12 w-12 ml-4 p-3"
                  @click="collection.handleLogoRemove()"
                >
                  <span class="icon-delete text-xl"></span>
                </button>
              </div>
            </div>
          </template>
          <p class="text-xs text-left mt-2">
            {{ $t('nft.collection.labelInfo.collectionLogoSize') }}
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      <n-upload
        ref="uploadRef"
        accept="image/png, image/jpeg"
        :show-file-list="false"
        :custom-request="e => onLogoUploaded(e, false)"
        @change="onUploadChange"
        @remove="collection.handleCoverImageRemove"
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
      <div v-if="collectionStore.form.base.coverImage?.id" class="flex mt-5 text-left">
        <div class="card w-full px-4 py-[10px]">
          <span class="icon-image text-xl align-sub mr-3"></span>
          <span>{{ collectionStore.form.base.coverImage.name }}</span>
        </div>
        <div>
          <button
            class="flex justify-center items-center h-12 w-12 ml-4 p-3"
            @click="collection.handleCoverImageRemove()"
          >
            <span class="icon-delete text-xl"></span>
          </button>
        </div>
      </div>
    </div>
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
    onFinish: collectionStore.form.base.logo?.onFinish,
    onError: collectionStore.form.base.logo?.onError,
  } as UploadCustomRequestOptions;

  collection.handleLogoRemove();
  collection.uploadFileRequest(uploadFile, true);
}

function onUploadChange(options: FileUploadOptions) {
  const uploadFile = {
    file: options.file,
    onProgress: () => {},
    onFinish: collectionStore.form.base.coverImage?.onFinish,
    onError: collectionStore.form.base.coverImage?.onError,
  } as UploadCustomRequestOptions;

  collection.handleCoverImageRemove();
  collection.uploadFileRequest(uploadFile, false);
}
</script>
