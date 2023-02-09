<template>
  <n-upload :show-file-list="false" multiple directory-dnd :custom-request="uploadFilesRequest">
    <n-upload-dragger :style="uploadHeight">
      <div class="py-2 text-center">
        <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
          <span class="icon-upload text-violet text-2xl"></span>
        </div>

        <h4 class="mb-1">{{ $t('storage.file.upload') }}</h4>
        <span class="text-body">{{ $t('storage.file.dragAndDrop') }}</span>
      </div>
    </n-upload-dragger>
  </n-upload>
</template>

<script lang="ts" setup>
const { uploadFilesRequest } = useUpload();
const dataStore = useDataStore();

/** Upload height */
const uploadHeight = computed(() => {
  return {
    height: dataStore.hasBucketItems ? 'auto' : 'calc(100vh - 370px)',
  };
});
</script>
