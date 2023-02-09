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
                uploading: numOfUploadedFiles,
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
          <strong>{{ $t('form.success.filesUploaded') }}</strong>
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
        <n-button class="w-full" type="primary" tertiary @click="upload()">
          <span class="text-primary">{{ $t('storage.file.retry') }}</span>
        </n-button>
      </div>
      <n-grid v-else class="w-full mt-10 mb-2" :cols="2" :span="2" :x-gap="8">
        <n-gi class="self-center">
          <n-checkbox
            v-model:checked="wrapToDirectoryCheckbox"
            size="medium"
            :label="$t('storage.wrapToDirectory')"
          />
        </n-gi>
        <n-gi>
          <Btn type="primary" size="large" @click="requestUpload">
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
          <n-button class="w-full" type="primary" @click="upload">
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
const props = defineProps({
  bucketUuid: { type: String, required: true },
});

const dataStore = useDataStore();
const { sessionUuid, uploadFiles, uploadFilesRequest, folderName } = useUpload();

const BASE_UPLOAD_SPEED = 1024;
const fileListExpanded = ref<boolean>(true);

/** Wrap files to directory */
const showModalWrapFolder = ref<boolean>(false);
const wrapToDirectoryCheckbox = ref<boolean>(false);

/**
 * Copmuted
 */

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

/** Check if any file is uploading (status UPLOADING) */
const filesUploading = computed<boolean>(() => {
  return (
    dataStore.bucket.uploadFileList.find(
      file => file.status === FileUploadStatusValue.UPLOADING
    ) !== undefined
  );
});

/** Num of uploaded files (status UPLOADING/FINISHED) */
const numOfUploadedFiles = computed<number>(() => {
  return (
    dataStore.bucket.uploadFileList.filter(file => file.status !== FileUploadStatusValue.PENDING)
      .length || 0
  );
});

/** Num of uploaded files (status FINISHED/ERROR) */
const numOfFinishedFiles = computed<number>(() => {
  return (
    dataStore.bucket.uploadFileList.filter(
      file =>
        file.status === FileUploadStatusValue.FINISHED ||
        file.status === FileUploadStatusValue.ERROR
    ).length || 0
  );
});

/**
 * Methods
 */

/** Upload wrapper functions - check if user want to wrap files */
function requestUpload() {
  if (wrapToDirectoryCheckbox.value && !showModalWrapFolder.value) {
    showModalWrapFolder.value = true;
    return;
  }
  upload();
}
function uploadSkipDirectory() {
  wrapToDirectoryCheckbox.value = false;
  upload();
}
function upload() {
  /** Clear last upload file list */
  removeFinishedFilesFromList();
  showModalWrapFolder.value = false;

  console.log('Storage: ', sessionUuid.value);
  uploadFiles(props.bucketUuid, dataStore.bucket.uploadFileList, wrapToDirectoryCheckbox.value);
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

/** Remove finished files from list */
function removeFinishedFilesFromList() {
  dataStore.bucket.uploadFileList =
    dataStore.bucket.uploadFileList.filter(
      file => file.status !== FileUploadStatusValue.FINISHED
    ) || [];
}

/** Format folder name (remove dissallowed characters) */
function handleFolderNameInput(value: string | [string, string]) {
  folderName.value = stripFolderName(value);
}
</script>
