<template>
  <div class="min-h-56 w-full min-w-[10rem]">
    <NftCard v-if="image?.id" class="mx-auto w-full" :image="image" @remove="() => handleImageRemove()" />
    <FormFieldUploadImage
      v-else
      ref="uploadRef"
      :custom-request="e => collection.uploadFileRequest(e, isLogo)"
      @remove="handleImageRemove"
    >
      <h6 v-if="isLogo" class="mb-1">{{ $t('nft.upload.avatar') }}</h6>
      <h6 v-else class="mb-1">{{ $t('nft.upload.cover') }}</h6>
      <span class="text-sm text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
    </FormFieldUploadImage>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  image: { type: Object as PropType<FileListItemType>, required: true },
  isLogo: { type: Boolean, default: false },
});

const metadataStore = useMetadataStore();
const collection = useCollection();

function handleImageRemove() {
  if (props.isLogo) {
    metadataStore.form.visual.logo = null;
  } else {
    metadataStore.form.visual.coverImage = null;
  }
}
</script>
