<template>
  <!-- MARK: this is a placeholder, need to implement logic, variables for collection logo and cover -->
  <div class="w-full">
    <div v-if="isLogo">
      <n-upload
        v-if="!collectionStore.form.base.logo?.id"
        class="w-full"
        accept="image/png, image/jpeg"
        :show-file-list="false"
        :custom-request="e => onLogoUploaded(e, true)"
      >
        <Btn class="w-full" type="secondary"> Select logo </Btn>
      </n-upload>
      <template v-else>
        <div class="flex text-left">
          <div class="card flex-1 px-4 py-2 rounded-lg">
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
        <div class="card w-full px-4 py-2">
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
defineProps({
  isLogo: { type: Boolean, default: false },
});

const collectionStore = useCollectionStore();
const collection = useCollection();

function onLogoUploaded(event: NUploadCustomRequestOptions, logo: boolean) {
  collection.uploadFileRequest(event, logo);
}

function onUploadChange(event: NUploadCustomRequestOptions) {
  collection.handleCoverImageChange(event);
}
</script>
