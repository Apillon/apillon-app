<template>
  <n-upload :show-file-list="false" multiple directory-dnd :custom-request="uploadFilesRequest">
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

const BASE_UPLOAD_SPEED = 1024;
const batchId = ref<string>('');
const sessionUuid = ref<string>('');
const fileList = ref<Array<FileListItemType>>([]);
const promises = ref<Array<Promise<any>>>([]);

/** Calculate average upload speed from uploaded files */
const avgUploadSpeed = computed(() => {
  const uploadSpeeds = fileList.value.filter(item => (item.uploadSpeed || 0) > 0);
  if (uploadSpeeds.length === 0) {
    return BASE_UPLOAD_SPEED;
  }

  const sumSpeeds = fileList.value.reduce(
    (acc, file) => acc + (file.uploadSpeed || BASE_UPLOAD_SPEED),
    0
  );
  return sumSpeeds / uploadSpeeds.length;
});

/**
 *  API call
 */
function uploadFilesRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  const fileListItem: FileListItemType = {
    ...file,
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
    onFinish,
    onError,
  };

  fileList.value.push(fileListItem);
  uploadFile(fileListItem);
}

async function uploadFile(file: FileListItemType) {
  /** Refresh timestamp */
  file.timestamp = Date.now();

  /** Refresh sessionUuid if batchId is new */
  if (file.batchId !== batchId.value) {
    sessionUuid.value = uuidv4();
    batchId.value = file.batchId || '';
  }

  const fileData: FormFileUploadRequest = {
    fileName: file.name,
    contentType: file.type || getExtension(file.name),
    path: fileFolderPath(file.fullPath || ''),
    session_uuid: sessionUuid.value,
  };

  createFileProgress(file.id);
  updateFileStatus(file.id, FileUploadStatusValue.UPLOADING);

  try {
    /** Upload file request */
    const request = $api.post<FileUploadRequestResponse>(
      endpoints.storageFileUpload(props.bucketUuid),
      fileData
    );
    promises.value.push(request);
    const res = await request;

    /** Upload file to S3 */
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', res.data.url, true);
    xhr.onload = () => {
      file.onFinish();
      updateFileStatus(file.id, FileUploadStatusValue.FINISHED);
      updateFilePercentage(file.id, 100);
      uploadSessionEnd(sessionUuid.value);
    };
    xhr.onerror = error => {
      file.onError();
      updateFileStatus(file.id, FileUploadStatusValue.ERROR);
      removeFileFromFileList(file.id);
      uploadSessionEnd(sessionUuid.value);

      /** Show error message */
      message.error(userFriendlyMsg(error));
    };
    xhr.send(file.file);
  } catch (error) {
    file.onError();
    updateFileStatus(file.id, FileUploadStatusValue.ERROR);
    removeFileFromFileList(file.id);

    /** Show error message */
    message.error(userFriendlyMsg(error));
  }
}

/** Upload Session End  */
async function uploadSessionEnd(sessionUuid: string) {
  if (!allFilesFinished.value) {
    return;
  }
  try {
    const params: Record<string, string | number | boolean | null> = {
      directSync: config.public.ENV === AppEnv.LOCAL,
    };
    const resSessionEnd = await $api.post<PasswordResetResponse>(
      endpoints.storageFileUpload(props.bucketUuid, sessionUuid),
      params
    );
    if (resSessionEnd.data) {
      message.success($i18n.t('form.success.filesUploaded'));
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  /** Clear file list */
  fileList.value = [] as Array<FileListItemType>;

  /** Refresh diretory content */
  await dataStore.fetchDirectoryContent();
}

/** Check if any file is uploading (status UPLOADING) */
const filesUploading = computed<boolean>(() => {
  return fileList.value.find(file => file.status === FileUploadStatusValue.UPLOADING) !== undefined;
});

/** Check if all files are finished (status FINISH or ERROR) */
const allFilesFinished = computed<boolean>(() => {
  return (
    fileList.value.find(
      file =>
        file.status !== FileUploadStatusValue.FINISHED &&
        file.status !== FileUploadStatusValue.ERROR
    ) === undefined
  );
});
const numOfFinishedFiles = computed<number>(() => {
  return (
    fileList.value.filter(
      file =>
        file.status === FileUploadStatusValue.FINISHED ||
        file.status === FileUploadStatusValue.ERROR
    ).length || 0
  );
});

/** Get folder path from fullPath */
function fileFolderPath(fullPath: string): string {
  const parts = fullPath.split('/');
  const filePath = parts.length <= 2 ? '' : parts.slice(0, -1).join('/');

  return dataStore.getFolderPath + filePath;
}

/** Calculate file upload progress */
function createFileProgress(fileId: string) {
  fileList.value.forEach(file => {
    if (file.id === fileId) {
      const timeFor1Percent = file.size / 100 / avgUploadSpeed.value;

      file.progress = setInterval(() => {
        if (file.percentage < 100) {
          file.percentage += 1;
        }
      }, timeFor1Percent);
    }
  });
}

/** Update file property */
function updateFilePercentage(fileId: string, percent: number) {
  fileList.value.forEach(item => {
    if (item.id === fileId) {
      item.percentage = percent;
    }
  });
}
function updateFileStatus(fileId: string, status: FileUploadStatus) {
  fileList.value.forEach(item => {
    if (item.id === fileId) {
      item.status = status;

      if (status === FileUploadStatusValue.ERROR) {
        item.percentage = 0;
        clearInterval(item.progress);
      }
      if (status === FileUploadStatusValue.FINISHED) {
        /** Calculate upload speed */
        const timeDiff = Date.now() - item.timestamp;
        if (timeDiff > 0) {
          item.uploadSpeed = item.size / timeDiff;
        }

        /** Increase bucket size */
        if (dataStore.bucket.active?.size) {
          dataStore.bucket.active.size += item.size;
        } else {
          dataStore.bucket.active.size = item.size;
        }

        clearInterval(item.progress);
      }
    }
  });
}

/** Remove one file from file list */
function removeFileFromFileList(fileId: string) {
  fileList.value.forEach(item => {
    if (item.id === fileId) {
      item.onError();
    }
  });
  fileList.value = fileList.value.filter(item => item.id !== fileId);
}
</script>
