<template>
  <!-- Upload - File list  -->
  <div
    v-if="dataStore.bucket.uploadFileList.length > 0"
    class="fixed right-0 bottom-0 w-[30rem] px-5 py-3 bg-bg-light border-1 border-bg-lighter z-10"
  >
    <!-- Header -->
    <n-space v-if="filesUploading" justify="space-between" align="center">
      <n-space justify="space-between" align="center">
        <IconUploading />
        <div>
          <strong>{{ $t('storage.file.uploading') }}</strong>
          <span class="ml-1 text-body">
            {{
              $t('storage.file.filesUploading', {
                uploading: numOfUploadingFiles,
                files: dataStore.bucket.uploadFileList.length,
              })
            }}
          </span>
        </div>
      </n-space>
      <n-space align="center">
        <button class="p-2" @click="fileListExpanded = !fileListExpanded">
          <span
            class="icon-down align-middle text-2xl"
            :class="[fileListExpanded ? 'icon-down' : 'icon-up']"
          ></span>
        </button>
        <button class="p-2" @click="clearFileList()">
          <span class="icon-close align-middle text-2xl"></span>
        </button>
      </n-space>
    </n-space>
    <n-space v-else-if="allFilesSuccess" justify="space-between" align="center">
      <n-space justify="space-between" align="center">
        <IconSuccessful />
        <div>
          <strong>{{ $t('storage.file.uploadSuccessful') }}</strong>
        </div>
      </n-space>
      <n-space align="center">
        <button class="p-2" @click="fileListExpanded = !fileListExpanded">
          <span
            class="icon-down align-middle text-2xl"
            :class="[fileListExpanded ? 'icon-down' : 'icon-up']"
          ></span>
        </button>
        <button class="p-2" @click="clearFileList()">
          <span class="icon-close align-middle text-2xl"></span>
        </button>
      </n-space>
    </n-space>
    <n-space v-else justify="space-between" align="center">
      <n-space justify="space-between" align="center">
        <span class="icon-upload align-middle text-2xl mr-2"></span>
        <div>
          <strong>{{ $t('storage.file.confirmUpload') }}</strong>
          <span class="ml-1 text-body">
            {{ $t('storage.file.files', { files: dataStore.bucket.uploadFileList.length }) }}
          </span>
        </div>
      </n-space>
      <button class="p-2" @click="clearFileList()">
        <span class="icon-delete align-middle text-2xl"></span>
      </button>
    </n-space>

    <!-- LIST -->
    <n-scrollbar v-if="fileListExpanded" class="max-h-72 mt-4" y-scrollable>
      <div v-for="file in dataStore.bucket.uploadFileList" :key="file.id">
        <StorageFileListItem
          :id="file.id"
          :name="file.name"
          :full-path="file.fullPath || ''"
          :percentage="file.percentage"
          :status="file.status"
          @remove-file="removeFileFromFileList"
        />
      </div>
    </n-scrollbar>

    <!-- Actions -->
    <template v-if="fileListExpanded">
      <div v-if="filesUploading" class="w-full mt-10 mb-2">
        <n-upload
          class="w-full"
          :show-file-list="false"
          multiple
          directory-dnd
          :custom-request="uploadFilesRequest"
        >
          <n-button class="w-full">
            <span class="text-primary">{{ $t('storage.file.uploadMore') }}</span>
          </n-button>
        </n-upload>
      </div>
      <div v-else-if="allFilesSuccess" class="w-full mt-10 mb-2">
        <n-button class="w-full" @click="clearFileList(true)">
          <span class="text-primary">{{ $t('storage.file.refresh') }}</span>
        </n-button>
      </div>
      <div v-else-if="allFilesFinished" class="w-full mt-10 mb-2">
        <n-button class="w-full" type="primary" tertiary @click="retryUpload()">
          <span class="text-primary">{{ $t('storage.file.retry') }}</span>
        </n-button>
      </div>
      <n-grid v-else class="w-full mt-10 mb-2" :cols="2" :span="2" :x-gap="8">
        <n-gi class="self-center">
          <n-checkbox
            v-model:checked="wrapToDirectory"
            size="medium"
            :label="$t('storage.wrapToDirectory')"
          />
        </n-gi>
        <n-gi>
          <Btn type="primary" size="large" @click="uploadNow">
            {{ $t('storage.file.uploadNow') }}
          </Btn>
        </n-gi>
      </n-grid>
    </template>

    <!-- Modal - Wrap files to folder -->
    <modal v-model:show="showModalWrapFolder" :title="$t('storage.wrapFiles')">
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
      <n-grid :cols="2" :span="2" :x-gap="8">
        <n-gi>
          <n-button class="w-full" type="primary" @click="uploadFiles">
            {{ $t('general.upload') }}
          </n-button>
        </n-gi>
        <n-gi>
          <n-button class="w-full" type="primary" ghost @click="uploadSkipDirectory">
            {{ $t('general.skip') }}
          </n-button>
        </n-gi>
      </n-grid>
    </modal>
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
const config = useRuntimeConfig();

const BASE_UPLOAD_SPEED = 1024;
const batchId = ref<string>('');
const sessionUuid = ref<string>('');
const fileListExpanded = ref<boolean>(true);
const promises = ref<Array<Promise<any>>>([]);

/** Wrap files to directory */
const showModalWrapFolder = ref<boolean>(false);
const wrapToDirectory = ref<boolean>(false);
const folderName = ref<string>('');

/** Calculate average upload speed from uploaded files */
const avgUploadSpeed = computed(() => {
  const uploadSpeeds = dataStore.bucket.uploadFileList.filter(item => (item.uploadSpeed || 0) > 0);
  if (uploadSpeeds.length === 0) {
    return BASE_UPLOAD_SPEED;
  }

  const sumSpeeds = dataStore.bucket.uploadFileList.reduce(
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

  if (fileAlreadyOnFileList(fileListItem)) {
    onError();
  } else {
    dataStore.bucket.uploadFileList.push(fileListItem);
  }
}

/** Upload wrapper functions */
function uploadNow() {
  if (wrapToDirectory.value && !showModalWrapFolder.value) {
    showModalWrapFolder.value = true;
    return;
  }
  uploadFiles();
}
function uploadSkipDirectory() {
  wrapToDirectory.value = false;
  uploadFiles();
}
function retryUpload() {
  removeFinishedFilesFromList();
  uploadFiles();
}
function uploadFiles() {
  dataStore.bucket.uploadFileList.forEach(file => {
    uploadFile(file);
  });
  showModalWrapFolder.value = false;
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
    xhr.open('PUT', res.data.signedUrlForUpload, true);
    xhr.onload = () => {
      file.onFinish();
      updateFileStatus(file.id, FileUploadStatusValue.FINISHED);
      updateFilePercentage(file.id, 100);
      uploadSessionEnd(sessionUuid.value);
    };
    xhr.onerror = error => {
      file.onError();
      updateFileStatus(file.id, FileUploadStatusValue.ERROR);
      uploadSessionEnd(sessionUuid.value);

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

/** Upload Session End  */
async function uploadSessionEnd(sessionUuid: string) {
  if (!allFilesFinished.value) {
    return;
  }
  try {
    const params: Record<string, string | number | boolean | null> = {
      directSync: config.public.ENV === AppEnv.LOCAL,
      wrapWithDirectory: wrapToDirectory.value,
      directoryPath: wrapToDirectory.value
        ? dataStore.getFolderPath + wrapperFolderPath(folderName.value)
        : null,
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
  /** Refresh diretory content */
  await dataStore.fetchDirectoryContent();
}

/** Get folder path from fullPath */
function fileFolderPath(fullPath: string): string {
  const parts = fullPath.split('/');
  const filePath = parts.length <= 2 ? '' : parts.slice(0, -1).join('/');

  return wrapToDirectory.value ? filePath : dataStore.getFolderPath + filePath;
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

/** Check if file is already on list */
function fileAlreadyOnFileList(file: FileListItemType) {
  return (
    dataStore.bucket.uploadFileList.find(
      item =>
        item.name === file.name &&
        item.fullPath === file.fullPath &&
        item.file?.lastModified === file.file?.lastModified
    ) !== undefined
  );
}

/** Update file property */
function updateFilePercentage(fileId: string, percent: number) {
  dataStore.bucket.uploadFileList.forEach(item => {
    if (item.id === fileId) {
      item.percentage = percent;
    }
  });
}
function updateFileStatus(fileId: string, status: FileUploadStatus) {
  dataStore.bucket.uploadFileList.forEach(item => {
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

/** Clear file list */
function clearFileList(refreshDirectoryContent: boolean = false) {
  dataStore.bucket.uploadFileList.forEach(item => {
    item.onError();
  });
  dataStore.bucket.uploadFileList = [] as Array<FileListItemType>;

  if (refreshDirectoryContent) {
    setTimeout(() => {
      dataStore.fetchDirectoryContent();
    }, 1000);
  }
}

/** Remove one file from file list */
function removeFileFromFileList(fileId: string) {
  dataStore.bucket.uploadFileList.forEach(item => {
    if (item.id === fileId) {
      item.onError();
    }
  });
  dataStore.bucket.uploadFileList = dataStore.bucket.uploadFileList.filter(
    item => item.id !== fileId
  );
}

/** Check if any file is uploading (status UPLOADING) */
const filesUploading = computed<boolean>(() => {
  return (
    dataStore.bucket.uploadFileList.find(
      file => file.status === FileUploadStatusValue.UPLOADING
    ) !== undefined
  );
});
const numOfUploadingFiles = computed<number>(() => {
  return (
    dataStore.bucket.uploadFileList.filter(file => file.status === FileUploadStatusValue.UPLOADING)
      .length || 0
  );
});

/** Check if all files are finished (status FINISH or ERROR) */
const allFilesFinished = computed<boolean>(() => {
  return (
    dataStore.bucket.uploadFileList.find(
      file =>
        file.status !== FileUploadStatusValue.FINISHED &&
        file.status !== FileUploadStatusValue.ERROR
    ) === undefined
  );
});

/** Check if all files are finished (status FINISH or ERROR) */
const allFilesSuccess = computed<boolean>(() => {
  return (
    dataStore.bucket.uploadFileList.find(file => file.status !== FileUploadStatusValue.FINISHED) ===
    undefined
  );
});

/** Remove finished files from list */
function removeFinishedFilesFromList() {
  dataStore.bucket.uploadFileList =
    dataStore.bucket.uploadFileList.filter(
      file => file.status !== FileUploadStatusValue.FINISHED
    ) || [];
}

/** Calculate file upload progress */
function createFileProgress(fileId: string) {
  dataStore.bucket.uploadFileList.forEach(file => {
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
  folderName.value = stripFolderName(value);
}
</script>
