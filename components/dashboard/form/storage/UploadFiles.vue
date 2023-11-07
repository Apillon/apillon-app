<template>
  <!-- Upload - File list  -->
  <div
    v-if="bucketStore.uploadFileList.length > 0"
    class="card fixed right-0 bottom-0 w-[30rem] px-5 py-3 z-10"
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
                files: bucketStore.uploadFileList.length,
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
            {{ $t('storage.file.files', { files: bucketStore.uploadFileList.length }) }}
          </span>
        </div>
      </n-space>
      <button class="p-2" @click="clearFileList()">
        <span class="icon-delete text-2xl align-middle"></span>
      </button>
    </n-space>

    <!-- LIST -->
    <n-scrollbar v-if="fileListExpanded" class="max-h-72 mt-4" y-scrollable>
      <div v-for="file in bucketStore.uploadFileList" :key="file.id">
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

const $i18n = useI18n();
const message = useMessage();
const bucketStore = useBucketStore();
const { uploadFiles, fileAlreadyOnFileList, isEnoughSpaceInStorage, folderName } = useUpload();

const fileListExpanded = ref<boolean>(true);

/** Wrap files to directory */
const showModalWrapFolder = ref<boolean>(false);
const wrapToDirectoryCheckbox = ref<boolean>(false);

/** Check if all files are finished (status FINISHED or ERROR) */
const allFilesFinished = computed<boolean>(() => {
  return !bucketStore.uploadFileList.some(
    file =>
      file.status === FileUploadStatusValue.PENDING ||
      file.status === FileUploadStatusValue.UPLOADING
  );
});
const allFilesSuccess = computed<boolean>(() => {
  return !bucketStore.uploadFileList.some(file => file.status !== FileUploadStatusValue.FINISHED);
});
const filesUploading = computed<boolean>(() => {
  return bucketStore.uploadFileList.some(file => file.status === FileUploadStatusValue.UPLOADING);
});
const numOfUploadedFiles = computed<number>(() => {
  return (
    bucketStore.uploadFileList.filter(file => file.status !== FileUploadStatusValue.PENDING)
      .length || 0
  );
});

/**
 * Methods
 */

/** Upload file request - add file to list */
function uploadFilesRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  const fileListItem: FileListItemType = {
    ...file,
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
    onFinish,
    onError,
  };
  if (!isEnoughSpaceInStorage(bucketStore.uploadFileList, fileListItem)) {
    message.warning($i18n.t('validation.notEnoughSpaceInStorage', { name: file.name }));
    onError();
  } else if (fileAlreadyOnFileList(bucketStore.uploadFileList, fileListItem)) {
    onError();
  } else {
    bucketStore.uploadFileList.push(fileListItem);
  }
}

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
async function upload() {
  /** Clear last upload file list */
  removeFinishedFilesFromList();
  showModalWrapFolder.value = false;

  try {
    await uploadFiles(props.bucketUuid, bucketStore.uploadFileList, wrapToDirectoryCheckbox.value);

    setTimeout(() => bucketStore.fetchDirectoryContent(), 5000);
  } catch (error) {
    /** Show error message */
    message.error(userFriendlyMsg(error));
  }
}

/** Clear file list */
function clearFileList(refreshDirectoryContent: boolean = false) {
  bucketStore.uploadFileList.forEach(item => {
    if (item.status !== FileUploadStatusValue.FINISHED) {
      item.onError();
    }
  });
  bucketStore.uploadFileList = [] as Array<FileListItemType>;

  if (refreshDirectoryContent) {
    setTimeout(() => {
      bucketStore.fetchDirectoryContent();
    }, 1000);
  }
}

/** Remove one file from file list */
function removeFileFromFileList(fileId: string) {
  bucketStore.uploadFileList.forEach(item => {
    if (item.id === fileId) {
      item.onError();
    }
  });
  bucketStore.uploadFileList = bucketStore.uploadFileList.filter(item => item.id !== fileId);
}

/** Remove finished files from list */
function removeFinishedFilesFromList() {
  bucketStore.uploadFileList =
    bucketStore.uploadFileList.filter(file => file.status !== FileUploadStatusValue.FINISHED) || [];
}

/** Format folder name (remove disallowed characters) */
function handleFolderNameInput(value: string | [string, string]) {
  folderName.value = stripFolderName(value);
}
</script>
