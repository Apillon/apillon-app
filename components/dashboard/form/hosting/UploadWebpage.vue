<template>
  <n-upload :show-file-list="false" multiple directory-dnd :custom-request="uploadFileRequest">
    <n-upload-dragger>
      <div class="py-2 text-center">
        <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
          <span class="icon-upload text-violet text-2xl"></span>
        </div>

        <h4 class="mb-1">{{ $t('storage.file.upload') }}</h4>
        <span class="text-body">{{ $t('storage.file.dragAndDrop') }}</span>
      </div>
    </n-upload-dragger>
  </n-upload>
  <n-space v-if="filesUploading" class="min-h-[32px] my-4" justify="center" align="center">
    <n-space justify="space-between" align="center">
      <IconUploading />
      <div>
        <strong>{{ $t('storage.file.uploading') }}</strong>
        <span class="ml-1 text-body">
          {{
            $t('storage.file.filesUploading', {
              uploading: numOfFinishedFiles,
              files: fileList.length,
            })
          }}
        </span>
      </div>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  bucketUuid: { type: String, required: true },
});

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const config = useRuntimeConfig();
const { sessionUuid, uploadFiles, fileAlreadyOnFileList, filesUploading } = useUpload();

const fileNum = ref<number>(0);
const uploadFileList = ref<Array<FileListItemType>>([]);
/**
 *  API call
 */
function uploadFileRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  const fileListItem: FileListItemType = {
    ...file,
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
    onFinish,
    onError,
  };

  if (fileAlreadyOnFileList(fileListItem)) {
    onError();
  } else {
    uploadFileList.value.push(fileListItem);
    fileNum.value = uploadFileList.value.length;
  }
  console.log('Hosting: ', sessionUuid.value);

  setTimeout(() => {
    console.log('10', fileNum.value, uploadFileList.value.length);
    uploadFiles(props.bucketUuid, uploadFileList.value);
  }, 10);
}
</script>
