<template>
  <div class="relative">
    <n-upload
      multiple
      directory-dnd
      :show-file-list="false"
      :disabled="authStore.isAdmin()"
      :custom-request="uploadFileRequest"
    >
      <n-upload-dragger>
        <div class="pb-12 text-center">
          <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
            <span class="icon-upload text-violet text-2xl"></span>
          </div>

          <h4 class="mb-1">{{ $t('indexer.upload.sourceCode') }}</h4>
          <span class="text-body">{{ $t('hosting.upload.dragAndDrop') }}</span>
          <SeparatorText class="mt-1 mb-1" :border-left="true">
            {{ $t('general.or') }}
          </SeparatorText>
        </div>
      </n-upload-dragger>
    </n-upload>
    <n-upload
      class="absolute inline-block w-auto left-1/2 bottom-4 -translate-x-1/2"
      :show-file-list="false"
      directory
      :disabled="authStore.isAdmin()"
      :custom-request="uploadDirectoryRequest"
    >
      <n-button>{{ $t('indexer.upload.directory') }}</n-button>
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
import type { UploadCustomRequestOptions } from 'naive-ui';

const props = defineProps({
  bucketUuid: { type: String, required: true },
});

const { t } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const bucketStore = useBucketStore();
const websiteStore = useWebsiteStore();
const { uploadFiles, fileAlreadyOnFileList, isEnoughSpaceInStorage } = useUpload();

const fileNum = ref<number>(0);
const uploadFileList = ref<FileListItemType[]>([]);
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
function uploadFileRequest({ file, onError, onFinish }: UploadCustomRequestOptions) {
  const fileListItem: FileListItemType = {
    ...file,
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
    onFinish,
    onError,
  };
  validateFileAndUpload(fileListItem);
}

/** Upload directory */
function uploadDirectoryRequest({ file, onError, onFinish }: UploadCustomRequestOptions) {
  const fileListItem: FileListItemType = {
    ...file,
    fullPath: removeBaseDirectoryFromFullPath(file.fullPath),
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
    onFinish,
    onError,
  };
  validateFileAndUpload(fileListItem);
}

function validateFileAndUpload(file: FileListItemType) {
  if (!isEnoughSpaceInStorage(uploadFileList.value, file)) {
    message.warning(t('validation.notEnoughSpaceInStorage', { name: file.name }));
    file.onError();
  } else if (fileAlreadyOnFileList(uploadFileList.value, file)) {
    file.onError();
  } else {
    addFileToListAndUpload(file);
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

  console.info(uploadFileList);

  if (uploadFileList.value.length === 1) {
    uploadInterval.value = setInterval(async () => {
      if (fileNum.value === uploadFileList.value.length) {
        /** Clear interval, upload started */
        clearInterval(uploadInterval.value);

        /** Show warning, if user don't upload HTML files */
        // checkForHtmlFiles(uploadFileList.value);

        /** When all files are on file list, start uploading files */
        // try {
        //   await uploadFiles(props.bucketUuid, uploadFileList.value, false, true);

        //   setTimeout(() => {
        //     bucketStore.fetchDirectoryContent();
        //   }, 4000);
        // } catch (error: ApiError | ReferenceError | TypeError | any) {
        //   /** Show error message */
        //   message.error(userFriendlyMsg(error));

        //   uploadFileList.value = [];
        // }
      }
    }, 10);
  }
  fileNum.value = uploadFileList.value.length;
}

// function checkForHtmlFiles(fileList: FileListItemType[]) {
//   websiteStore.missingHtml = false;

//   if (websiteStore.active?.bucket?.size === 0) {
//     const indexFile = fileList.some(item => item.name === 'index.html');
//     const htmlFile = fileList.some(item => item.name.includes('.html'));

//     if (!htmlFile) {
//       message.error(t('validation.hosting.missingHtml'));
//       websiteStore.missingHtml = true;
//     } else if (!indexFile) {
//       message.warning(t('validation.hosting.missingIndex'));
//     }
//   }
// }
</script>
