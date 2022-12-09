<template>
  <n-upload :show-file-list="false" multiple directory-dnd :custom-request="uploadFiles">
    <n-upload-dragger>
      <div class="text-sm">
        <span>Drag & drop files and folders you want to upload to your bucket, or</span>
        <strong class="text-primary"> Click to upload. </strong>
      </div>
    </n-upload-dragger>
    <n-scrollbar class="max-h-[50vh]" y-scrollable>
      <div v-if="fileList" class="n-upload-file-list mt-4">
        <div v-for="file in fileList" class="n-upload-file">
          <div class="flex pt-2 pb-1">
            <div class="w-full">
              <div class="">
                <span class="text-sm mr-4">{{ file.name }}</span>
                <span class="text-sm opacity-60">{{ formatBytes(file.size) }}</span>
              </div>
              <n-progress
                type="line"
                :percentage="file.percentage"
                :border-radius="0"
                :height="4"
              />
            </div>
            <div class="flex items-center justify-end min-w-[80px]">
              <span
                v-if="file.status === FileUploadStatusValue.FINISHED"
                class="icon-check text-lg text-green"
              ></span>
              <span
                v-else-if="file.status === FileUploadStatusValue.UPLOADING"
                class="icon-delete text-lg"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </n-scrollbar>
  </n-upload>
</template>

<script lang="ts" setup>
import { NUpload, NUploadDragger, useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadStatus } from '~~/lib/values';
import { FileListItem } from '~~/types/component';

const props = defineProps({
  bucketUuid: { type: String, required: true },
});

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();

const batchId = ref<string>('');
const sessionUuid = ref<string>('');
const fileList = ref<Array<FileListItem>>([]);
const promises = ref<Array<Promise<any>>>([]);

/**
 *  API calls
 */
async function uploadFiles({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  /** Show loader in table */
  dataStore.folder.loading = true;

  /** Refresh sessionUuid if batchId is new */
  if (file.batchId !== batchId.value) {
    sessionUuid.value = uuidv4();
    batchId.value = file.batchId || '';
    // fileList.value = [];
  }

  const fileData: FormFileUploadRequest = {
    fileName: file.name || '',
    contentType: file.type || '',
    path: dataStore.getFolderPath + fileFolderPath(file.fullPath || ''),
  };

  const fileListItem = {
    id: file.id,
    name: file.name,
    status: FileUploadStatusValue.UPLOADING,
    percentage: 0,
    size: file.file?.size || 0,
  };
  fileList.value.push(fileListItem);

  try {
    /** Upload file request */
    const request = $api.post<FileUploadRequestResponse>(
      `/storage/${props.bucketUuid}/file-upload/${sessionUuid.value}`,
      fileData
    );
    promises.value.push(request);
    const res = await request;

    /** Upload file to S3 */
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', res.data.signedUrlForUpload, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.LOADING) {
        createFileProgress(fileListItem);
      }
    };
    xhr.onload = () => {
      onFinish();
      updateFileStatus(file.id, FileUploadStatusValue.FINISHED);
      updateFilePercentage(file.id, 100);
      uploadSessionEnd(sessionUuid.value);
    };
    xhr.onerror = error => {
      onError();
      updateFileStatus(file.id, FileUploadStatusValue.ERROR);
      uploadSessionEnd(sessionUuid.value);
      message.error(userFriendlyMsg(error, $i18n));
    };
    xhr.send(file.file);
  } catch (error) {
    onError();
    updateFileStatus(file.id, FileUploadStatusValue.ERROR);
    message.error(userFriendlyMsg(error, $i18n));
    dataStore.folder.loading = false;
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
    }
  });
}
function createFileProgress(fileListItem) {}

/** Upload Session End */
async function uploadSessionEnd(sessionUuid: string) {
  const uploadingFiles = fileList.value.find(
    file => file.status === FileUploadStatusValue.UPLOADING
  );
  if (uploadingFiles) {
    return;
  }

  try {
    const url = `/storage/${props.bucketUuid}/file-upload/${sessionUuid}/end`;
    const resSessionEnd = await $api.post<PasswordResetResponse>(url, { directSync: true });

    if (resSessionEnd.data) {
      message.success($i18n.t('storage.filesUploaded'));
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
    dataStore.folder.loading = false;
  }

  /** Refresh diretory content */
  dataStore.fetchDirectoryContent($i18n);
}
</script>
