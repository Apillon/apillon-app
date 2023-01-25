<template>
  <div>
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

    <!-- Upload - File list  -->
    <div
      v-if="fileList && fileList.length > 0"
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
                  files: fileList.length,
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
          <button class="p-2" @click="clearFileList">
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
              {{ $t('storage.file.files', { files: fileList.length }) }}
            </span>
          </div>
        </n-space>
        <button class="p-2" @click="clearFileList()">
          <span class="icon-delete align-middle text-2xl"></span>
        </button>
      </n-space>

      <!-- LIST -->
      <n-scrollbar v-if="fileList && fileListExpanded" class="max-h-72 mt-4" y-scrollable>
        <div v-for="file in fileList" :key="file.id">
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
            <Btn type="primary" size="large" @click="uploadFiles">
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
            <n-button class="w-full" type="primary" @click="uploadDirectory">
              {{ $t('general.upload') }}
            </n-button>
          </n-gi>
          <n-gi>
            <n-button class="w-full" type="primary" ghost @click="uploadFiles">
              {{ $t('general.skip') }}
            </n-button>
          </n-gi>
        </n-grid>
      </modal>
    </div>
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
const fileListExpanded = ref<boolean>(true);
const promises = ref<Array<Promise<any>>>([]);

/** Upload height */
const uploadHeight = computed(() => {
  return {
    height: (dataStore.bucket?.active?.size || 0) > 0 ? 'auto' : 'calc(100vh - 370px)',
  };
});

/** Wrap files to directory */
const showModalWrapFolder = ref<boolean>(false);
const wrapToDirectory = ref<boolean>(false);
const folderName = ref<string>('');

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
  console.log(getExtension(fileListItem.name));

  if (fileAlreadyOnFileList(fileListItem)) {
    onError();
  } else {
    fileList.value.push(fileListItem);
  }
}

/** Upload wrapper functions */
function uploadFiles() {
  if (wrapToDirectory.value && !showModalWrapFolder.value) {
    showModalWrapFolder.value = true;
    return;
  }

  fileList.value.forEach(file => {
    uploadFile(file, wrapToDirectory.value);
  });
  showModalWrapFolder.value = false;
}
function uploadDirectory() {
  fileList.value.forEach(file => {
    uploadFile(file, true);
  });
  showModalWrapFolder.value = false;
}
function retryUpload() {
  removeFinishedFilesFromList();

  fileList.value.forEach(file => {
    uploadFile(file, wrapToDirectory.value);
  });
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
    contentType: file.type || getExtension(file.name),
    path: dataStore.getFolderPath + fileFolderPath(file.fullPath || ''),
  };
  if (wrapToFolder) {
    fileData.session_uuid = sessionUuid.value;
    fileData.path = fileFolderPath(file.fullPath || '');
  }

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

/** Check if file is already on list */
function fileAlreadyOnFileList(file: FileListItemType) {
  return (
    fileList.value.find(
      item =>
        item.name === file.name &&
        item.fullPath === file.fullPath &&
        item.file?.lastModified === file.file?.lastModified
    ) !== undefined
  );
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

/** Clear file list */
function clearFileList(refreshDirectoryContent: boolean = false) {
  fileList.value.forEach(item => {
    item.onError();
  });
  fileList.value = [] as Array<FileListItemType>;

  if (refreshDirectoryContent) {
    dataStore.fetchDirectoryContent();
  }
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

/** HOSTING: Upload Session End  */
async function uploadSessionEnd(sessionUuid: string) {
  if (!allFilesFinished.value) {
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
  await dataStore.fetchDirectoryContent();
}

/** Check if any file is uploading (status UPLOADING) */
const filesUploading = computed<boolean>(() => {
  return fileList.value.find(file => file.status === FileUploadStatusValue.UPLOADING) !== undefined;
});
const numOfUploadingFiles = computed<number>(() => {
  return fileList.value.filter(file => file.status === FileUploadStatusValue.UPLOADING).length || 0;
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

/** Check if all files are finished (status FINISH or ERROR) */
const allFilesSuccess = computed<boolean>(() => {
  return fileList.value.find(file => file.status !== FileUploadStatusValue.FINISHED) === undefined;
});

/** Remove finished files from list */
function removeFinishedFilesFromList() {
  fileList.value =
    fileList.value.filter(file => file.status !== FileUploadStatusValue.FINISHED) || [];
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
