<template>
  <n-upload :show-file-list="false" :custom-request="uploadFileRequest">
    <n-upload-dragger style="height: calc(100vh - 420px)">
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
import { useMessage } from 'naive-ui';

const message = useMessage();
const collectionStore = useCollectionStore();

/** Upload file request - add file to list */
function uploadFileRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  if (file.type !== 'text/csv') {
    message.warning('text/csv');
    return;
  }

  collectionStore.csvFile = {
    ...file,
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
    onFinish,
    onError,
  };
  console.log(collectionStore.csvFile);
}
</script>
