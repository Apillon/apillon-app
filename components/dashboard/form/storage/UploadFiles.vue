<template>
  <div>
    <n-upload :show-file-list="false" multiple directory-dnd :custom-request="uploadFilesRequest">
      <n-upload-dragger>
        <div class="text-sm">
          <span class="mr-1">{{ $t('storage.file.dragAndDrop') }}</span>
          <strong class="text-primary">{{ $t('storage.file.clickToUpload') }}</strong>
        </div>
      </n-upload-dragger>
    </n-upload>

    <n-scrollbar class="max-h-[50vh]" y-scrollable>
      <div v-if="fileList" class="n-upload-file-list mt-4">
        <div v-for="file in fileList" class="n-upload-file">
          <StorageFileListItem v-bind="file" />
        </div>
      </div>
    </n-scrollbar>

    <n-space
      v-if="fileList && fileList.length > 0"
      class="upload-actions"
      justify="end"
      align="center"
    >
      <div class="wrap-directory">
        <n-checkbox
          v-model:checked="wrapToDirectory"
          size="medium"
          :label="$t('storage.wrapToDirectory')"
        />
      </div>
      <n-button type="primary" @click="uploadFiles">{{ $t('general.upload') }}</n-button>
    </n-space>

    <!-- Modal - Wrap files to folder -->
    <modal
      v-model:show="showModalWrapFolder"
      :title="$t('storage.wrapFiles')"
      @update:show="onModalShow"
    >
      <p>{{ $t('storage.wrapFilesDescription') }}</p>
      <br />
      <!--  Folder name -->
      <n-form-item
        path="name"
        :label="$t('form.label.folderName')"
        :label-props="{ for: 'folderName' }"
      >
        <n-input
          v-model:value="folderName"
          :placeholder="$t('form.placeholder.folderName')"
          @input="handleFolderNameInput"
        />
      </n-form-item>
      <n-button type="primary" @click="uploadDirectory">{{ $t('general.upload') }}</n-button>
    </modal>
  </div>
</template>

<script lang="ts" setup>
import { NUpload, NUploadDragger, useMessage } from 'naive-ui';
import { v4 as uuidv4 } from 'uuid';
import { textMarshal } from 'text-marshal';

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

/** Wrap files to directory */
const showModalWrapFolder = ref<boolean>(false);
const wrapToDirectory = ref<boolean>(false);
const folderName = ref<string>('');

watch(
  () => wrapToDirectory.value,
  wrap => {
    if (wrap) {
      showModalWrapFolder.value = wrap;
    }
  }
);
function onModalShow(value: boolean) {
  if (!value) {
    wrapToDirectory.value = false;
  }
}

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
}

async function uploadFiles() {
  if (wrapToDirectory.value) {
    showModalWrapFolder.value = true;
    return;
  }

  fileList.value.forEach(file => {
    uploadFile(file);
  });
}
async function uploadDirectory() {
  fileList.value.forEach(file => {
    uploadFile(file, true);
  });
  showModalWrapFolder.value = false;
}

async function uploadFile(file: FileListItemType, wrapToFolder: Boolean = false) {
  /** Refresh timestamp */
  file.timestamp = Date.now();

  /** Refresh sessionUuid if batchId is new */
  if (file.batchId !== batchId.value) {
    sessionUuid.value = uuidv4();
    batchId.value = file.batchId || '';
  }

  const fileData: FormFileUploadRequest = {
    fileName: file.name,
    contentType: file.type || '',
    path: dataStore.getFolderPath + fileFolderPath(file.fullPath || ''),
  };
  if (wrapToFolder) {
    fileData.session_uuid = sessionUuid.value;
    fileData.path = fileFolderPath(file.fullPath || '');
  }

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
    xhr.onload = () => {
      file.onFinish();
      updateFileStatus(file.id, FileUploadStatusValue.FINISHED);
      updateFilePercentage(file.id, 100);

      /** Upload directory - use session */
      if (wrapToFolder) {
        uploadSessionEnd(sessionUuid.value);
      }
    };
    xhr.onerror = error => {
      file.onError();
      updateFileStatus(file.id, FileUploadStatusValue.ERROR);

      if (wrapToFolder) {
        uploadSessionEnd(sessionUuid.value);
      }

      /** Show error message */
      message.error(userFriendlyMsg(error));
    };
    xhr.send(file.file);
  } catch (error) {
    file.onError();
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

/** Get wrapper folder path from user's input */
function wrapperFolderPath(path: string): string {
  if (path.length < 1) {
    return '';
  }
  return (
    '/' +
    path
      .split('/')
      .filter(p => p)
      .join('/')
  );
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

          /** After 3s, remove finished files */
          setTimeout(() => {
            removeFinishedFilesFromList();
          }, 5000);
        }
      }
    }
  });
}

/** HOSTING: Upload Session End  */
async function uploadSessionEnd(sessionUuid: string) {
  if (!allFilesFinished()) {
    return;
  }
  try {
    const resSessionEnd = await $api.post<PasswordResetResponse>(
      endpoints.storageFileUpload(props.bucketUuid, sessionUuid),
      {
        directSync: config.public.ENV === AppEnv.LOCAL,
        wrapWithDirectory: true,
        directoryPath: dataStore.getFolderPath + wrapperFolderPath(folderName.value),
      }
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

/** Check if all files are finished (status FINISH or ERROR) */
function allFilesFinished(): boolean {
  const uploadingFiles = fileList.value.find(
    file =>
      file.status === FileUploadStatusValue.PENDING ||
      file.status === FileUploadStatusValue.UPLOADING
  );
  return uploadingFiles === undefined;
}

/** Remove finished files from list */
function removeFinishedFilesFromList() {
  fileList.value =
    fileList.value.filter(file => file.status !== FileUploadStatusValue.FINISHED) || [];
}

/** Calculate file upload progress */
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

/** Format folder name (remove dissallowed characters) */
function handleFolderNameInput(value: string | [string, string]) {
  const data = textMarshal({
    input: value,
    template: 'x',
    disallowCharacters: [/@/, /\\/, /\//, /\|/, /\!/, /\#/, /\$/, /\%/, /\^/, /\&/, /\*/],
    isRepeat: {
      value: true,
      removeStart: true,
      removeEnd: true,
    },
  });
  folderName.value = data.marshaltext;
}
</script>
