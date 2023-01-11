<template>
  <div>
    <n-upload :show-file-list="false" multiple directory :custom-request="uploadFiles">
      <n-button>Upload directory</n-button>
    </n-upload>

    <n-scrollbar class="max-h-[50vh]" y-scrollable>
      <div v-if="fileList" class="n-upload-file-list mt-4">
        <div v-for="file in fileList" class="n-upload-file">
          <StorageFileListItem v-bind="file" />
        </div>
      </div>
    </n-scrollbar>
  </div>
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
 *  API calls
 */
async function uploadFiles({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  /** Refresh sessionUuid if batchId is new */
  if (file.batchId !== batchId.value) {
    sessionUuid.value = uuidv4();
    batchId.value = file.batchId || '';
  }

  const fileData: FormFileUploadRequest = {
    fileName: file.name || '',
    contentType: file.type || '',
    path: dataStore.getFolderPath + fileFolderPath(file.fullPath || ''),
    session_uuid: sessionUuid.value,
  };

  const fileListItem: FileListItemType = {
    id: file.id,
    name: file.name,
    status: FileUploadStatusValue.UPLOADING,
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
  };
  fileList.value.push(fileListItem);
  createFileProgress(file.id);

  try {
    /** Upload file request */
    const request = $api.post<FileUploadRequestResponse>(
      endpoints.storageFileUpload(props.bucketUuid),
      fileData
    );
    promises.value.push(request);
    const res = await request;

    /** Upload file to S3 */
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', res.data.signedUrlForUpload, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
      }
    };
    xhr.onload = async () => {
      /** Sync to IPFS */
      await syncToIpfs(res.data.file_uuid);

      onFinish();
      updateFileStatus(file.id, FileUploadStatusValue.FINISHED);
      updateFilePercentage(file.id, 100);
      uploadSessionEnd(sessionUuid.value);
    };
    xhr.onerror = error => {
      onError();
      updateFileStatus(file.id, FileUploadStatusValue.ERROR);
      uploadSessionEnd(sessionUuid.value);

      /** Show error message */
      message.error(userFriendlyMsg(error));
    };
    xhr.send(file.file);
  } catch (error) {
    onError();
    updateFileStatus(file.id, FileUploadStatusValue.ERROR);

    /** Show error message */
    message.error(userFriendlyMsg(error));
  }
}

/** Get folder path from fullPath */
function fileFolderPath(fullPath: string): string {
  const parts = fullPath.split('/');
  if (parts.length <= 2) {
    return '';
  }
  return parts.slice(0, -1).join('/');
}

/** Update file property */
function updateFilePercentage(fileId: string, percent: number) {
  fileList.value.map(item => {
    if (item.id === fileId) {
      item.percentage = percent;
    }
  });
}
function updateFileStatus(fileId: string, status: FileUploadStatus) {
  fileList.value.map(item => {
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

        /** Refresh diretory content */
        if (allFilesFinished()) {
          dataStore.fetchDirectoryContent();
        }
      }
    }
  });
}
function createFileProgress(fileId: string) {
  fileList.value.map(file => {
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

/** TEMPORARLY: Sync to IPFS */
async function syncToIpfs(fileUuid: string) {
  try {
    await $api.post(endpoints.storageSyncToIpfs(props.bucketUuid, fileUuid));

    message.success($i18n.t('form.success.filesUploaded'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
}

/** HOSTING: Upload Session End - Currently not in use */
async function uploadSessionEnd(sessionUuid: string) {
  console.log(sessionUuid);
  console.log(allFilesFinished());
  if (!allFilesFinished()) {
    return;
  }
  console.log('uploadSessionEnd');

  try {
    const resSessionEnd = await $api.post<PasswordResetResponse>(
      endpoints.storageFileUpload(props.bucketUuid, sessionUuid),
      { directSync: false }
    );

    if (resSessionEnd.data) {
      message.success($i18n.t('form.success.filesUploaded'));
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }

  /** Refresh diretory content */
  dataStore.fetchDirectoryContent();
}

function allFilesFinished(): boolean {
  const uploadingFiles = fileList.value.find(
    file => file.status === FileUploadStatusValue.UPLOADING
  );
  return uploadingFiles === undefined;
}
</script>
