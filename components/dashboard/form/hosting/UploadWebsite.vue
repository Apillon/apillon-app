<template>
  <div class="relative">
    <n-upload :show-file-list="false" multiple directory-dnd :custom-request="uploadFileRequest">
      <n-upload-dragger>
        <div class="pb-12 text-center">
          <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
            <span class="icon-upload text-violet text-2xl"></span>
          </div>

          <h4 class="mb-1">{{ $t('hosting.upload.files') }}</h4>
          <span class="text-body">{{ $t('hosting.upload.dragAndDrop') }}</span>
          <div class="flex items-center">
            <span class="bg-white h-[1px] w-full"></span>
            <strong class="inline-block px-5 mx-[8%] text-body whitespace-nowrap">
              {{ $t('general.or') }}
            </strong>
            <span class="bg-white h-[1px] w-full"></span>
          </div>
        </div>
      </n-upload-dragger>
    </n-upload>
    <n-upload
      class="absolute inline-block w-auto left-1/2 bottom-4 -translate-x-1/2"
      :show-file-list="false"
      directory
      :custom-request="uploadDirectoryRequest"
    >
      <n-button>{{ $t('hosting.upload.directory') }}</n-button>
    </n-upload>
  </div>
  <n-space v-if="uploadFileList.length" class="min-h-[32px] my-4" justify="center" align="center">
    <n-space justify="space-between" align="center">
      <IconUploading />
      <div>
        <strong>{{ $t('storage.file.uploading') }}</strong>
        <span class="ml-1 text-body">
          {{
            $t('storage.file.filesUploading', {
              uploading: numOfFinishedFiles,
              files: uploadFileList.length,
            })
          }}
        </span>
      </div>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const props = defineProps({
  bucketUuid: { type: String, required: true },
});

const { uploadFiles, fileAlreadyOnFileList } = useUpload();

const fileNum = ref<number>(0);
const uploadFileList = ref<Array<FileListItemType>>([]);
const uploadInterval = ref<any>(null);

const numOfFinishedFiles = computed<number>(() => {
  return (
    uploadFileList.value.filter(
      file =>
        file.status === FileUploadStatusValue.FINISHED ||
        file.status === FileUploadStatusValue.ERROR
    ).length || 0
  );
});

/** Upload files */
function uploadFileRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  const fileListItem: FileListItemType = {
    ...file,
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
    onFinish,
    onError,
  };

  if (fileAlreadyOnFileList(uploadFileList.value, fileListItem)) {
    onError();
  } else {
    addFileToListAndUpload(fileListItem);
  }
}

/** Upload directory */
function uploadDirectoryRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  const fileListItem: FileListItemType = {
    ...file,
    fullPath: removeBaseDirectoryFromFullPath(file.fullPath),
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
    onFinish,
    onError,
  };

  if (fileAlreadyOnFileList(uploadFileList.value, fileListItem)) {
    onError();
  } else {
    addFileToListAndUpload(fileListItem);
  }
}

/** Remove first (base) directory, if user upload entire folder */
function removeBaseDirectoryFromFullPath(fullPath?: string | null) {
  if (!fullPath) return '';

  const pathParts = fullPath.split('/').filter(p => p);
  return pathParts.length <= 1 ? fullPath : '/' + pathParts.slice(1).join('/');
}

/** Add file to list and upload it */
function addFileToListAndUpload(fileListItem: FileListItemType) {
  uploadFileList.value.push(fileListItem);

  if (uploadFileList.value.length === 1) {
    uploadInterval.value = setInterval(() => {
      if (fileNum.value === uploadFileList.value.length) {
        /** When all files are on file list, start uploading files */
        uploadFiles(props.bucketUuid, uploadFileList.value, false, true);

        /** Clear interval, upload started */
        clearInterval(uploadInterval.value);
      }
    }, 10);
  }
  fileNum.value = uploadFileList.value.length;
}
</script>