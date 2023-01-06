<template>
  <n-space justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="dataStore.folder.search"
        type="text"
        name="search"
        size="small"
        class="bg-grey-dark"
        :placeholder="$t('storage.file.search')"
        clearable
      />
    </div>
    <n-space>
      <!-- Refresh directory content -->
      <n-button size="small" @click="refreshDirectoryContent">
        {{ $t('storage.refresh') }}
      </n-button>

      <!-- Create folder -->
      <n-button size="small" @click="showModalNewFolder = true">
        {{ $t('storage.folder.create') }}
      </n-button>

      <!-- Upload files -->
      <n-button
        size="small"
        :color="dataStore.folder.uploadActive ? colors.primary : ''"
        ghost
        @click="dataStore.folder.uploadActive = !dataStore.folder.uploadActive"
      >
        {{ $t('general.upload') }}
      </n-button>

      <!-- Download files -->
      <n-tooltip placement="bottom" :show="showPopoverDownload">
        <template #trigger>
          <n-button
            size="small"
            :focus="true"
            :title="$t('storage.selectFiles')"
            :loading="downloading"
            @click="downloadSelectedFiles"
          >
            {{ $t('general.download') }}
          </n-button>
        </template>
        <span>{{ $t('storage.selectFiles') }}</span>
      </n-tooltip>

      <!-- Delete files -->
      <n-tooltip placement="bottom" :show="showPopoverDelete">
        <template #trigger>
          <n-button
            size="small"
            :active="true"
            :title="$t('storage.selectFiles')"
            @click="deleteSelectedFiles"
          >
            {{ $t('general.delete') }}
          </n-button>
        </template>
        <span>{{ $t('storage.selectFiles') }}</span>
      </n-tooltip>
    </n-space>
  </n-space>

  <!-- Modal - Create new folder -->
  <modal v-model:show="showModalNewFolder" :title="$t('storage.folder.createNew')">
    <FormStorageFolderCreate @submit-success="onFolderCreated" />
  </modal>

  <!-- Modal - Delete file/folder -->
  <modal v-model:show="showModalDelete" :title="$t(`storage.delete.bucketItems`)">
    <FormStorageFolderDelete :items="dataStore.folder.selectedItems" @submit-success="onDeleted" />
  </modal>
</template>

<script lang="ts" setup>
import colors from '~~/tailwind.colors';
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const downloading = ref<boolean>(false);
const showModalNewFolder = ref<boolean>(false);
const showModalDelete = ref<boolean>(false);
const showPopoverDelete = ref<boolean>(false);
const showPopoverDownload = ref<boolean>(false);

/** Refresh directory content */
function refreshDirectoryContent() {
  dataStore.fetchDirectoryContent($i18n);
}

function onFolderCreated() {
  showModalNewFolder.value = false;

  /** Refresh directory content */
  dataStore.fetchDirectoryContent($i18n);
}

/**
 * Download
 */
async function downloadSelectedFiles() {
  if (dataStore.folder.selectedItems.length === 0) {
    showPopoverDownload.value = true;

    setTimeout(() => {
      showPopoverDownload.value = false;
    }, 3000);
    return;
  }

  const promises: Array<Promise<any>> = [];
  downloading.value = true;

  dataStore.folder.selectedItems.forEach(async item => {
    const req = downloadFile(item.CID);
    promises.push(req);
    await req;
  });

  Promise.all(promises).then(async _ => {
    downloading.value = false;
    console.log('loaded');
  });
  console.log(promises);
}
/** Download file - get file details and download content from downloadLink */
async function downloadFile(CID?: string | null) {
  if (!CID) {
    console.warn('MISSING File CID!');
    return;
  }
  try {
    if (!(CID in dataStore.file.items)) {
      dataStore.file.items[CID] = await dataStore.fetchFileDetails(CID, $i18n);
    }
    const fileDetails: FileDetails = dataStore.file.items[CID].file;
    return download(fileDetails.downloadLink, fileDetails.name);
  } catch (error: any) {
    /** Show error message */
    message.error($i18n.t('error.fileDownload'));
  }
  return null;
}

/**
 * Delete
 */
function deleteSelectedFiles() {
  if (dataStore.folder.selectedItems.length === 0) {
    showPopoverDelete.value = true;

    setTimeout(() => {
      showPopoverDelete.value = false;
    }, 3000);
    return;
  }

  showModalDelete.value = true;
}

/** On folder deleted, refresh folder list */
async function onDeleted() {
  await dataStore.fetchDirectoryContent($i18n);
  showModalDelete.value = false;
}
</script>
