<template>
  <div class="min-h-56 w-full min-w-[10rem]">
    <div v-if="image?.id" class="mx-auto w-full overflow-hidden rounded-xl bg-bg-light">
      <figure class="flex h-full flex-col">
        <Image :src="createThumbnailUrl(image)" class="h-full w-full object-contain" :alt="image.name" />
        <figcaption class="block h-12 px-4 py-3 font-bold">
          {{ image.name }}
          <button class="float-right flex items-center justify-center p-1" @click="handleImageRemove()">
            <span class="icon-delete text-xl"></span>
          </button>
        </figcaption>
      </figure>
    </div>
    <n-upload
      v-else
      ref="uploadRef"
      accept="image/*"
      :show-file-list="false"
      :custom-request="e => collection.uploadFileRequest(e, isLogo)"
      @change="onUploadChange"
      @remove="handleImageRemove"
    >
      <n-upload-dragger class="flex-cc h-56">
        <div class="py-2 text-center">
          <div class="mb-2 inline-block h-10 w-10 rounded-full bg-bg-lighter p-2">
            <span class="icon-image text-2xl text-violet"></span>
          </div>

          <h4 v-if="isLogo" class="mb-1">{{ t('nft.upload.avatar') }}</h4>
          <h4 v-else class="mb-1">{{ t('nft.upload.cover') }}</h4>
          <span class="text-sm text-body">{{ t('nft.upload.dragAndDrop') }}</span>
        </div>
      </n-upload-dragger>
    </n-upload>
  </div>
</template>

<script setup lang="ts">
import type { UploadCustomRequestOptions } from 'naive-ui';

const props = defineProps({
  image: { type: Object as PropType<FileListItemType>, required: true },
  isLogo: { type: Boolean, default: false },
});

const { t } = useI18n();
const collectionStore = useCollectionStore();
const collection = useCollection();
const { createThumbnailUrl } = useNft();

function onUploadChange(options: FileUploadOptions) {
  const uploadFile = {
    file: options.file,
    onProgress: () => {},
    onFinish: props.image?.onFinish || (() => {}),
    onError: props.image?.onError || (() => {}),
  } as UploadCustomRequestOptions;

  handleImageRemove();
  collection.uploadFileRequest(uploadFile, props.isLogo);
}

function handleImageRemove() {
  if (props.isLogo) {
    collectionStore.form.base.logo = null;
  } else {
    collectionStore.form.base.coverImage = null;
  }
}
</script>
