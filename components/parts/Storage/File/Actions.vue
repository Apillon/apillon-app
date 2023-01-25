<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="dataStore.folder.search"
        type="text"
        name="search"
        size="small"
        :placeholder="$t('storage.file.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-xl"></span>
        </template>
      </n-input>
    </div>

    <n-space size="large">
      <!-- Show only if user select files -->
      <template v-if="dataStore.folder.selectedItems.length > 0">
        <!-- Download files -->
        <n-tooltip :show="showPopoverDownload" placement="bottom">
          <template #trigger>
            <n-button
              class="w-10"
              size="small"
              :focus="true"
              :loading="downloading"
              @click="downloadSelectedFiles"
            >
              <span class="icon-download"></span>
            </n-button>
          </template>
          <span>{{ $t('storage.downloadSelectedFiles') }}</span>
        </n-tooltip>

        <!-- Delete files -->
        <n-tooltip placement="bottom" :show="showPopoverDelete">
          <template #trigger>
            <n-button class="w-10" size="small" :active="true" @click="deleteSelectedFiles">
              <span class="icon-delete text-pink"></span>
            </n-button>
          </template>
          <span>{{ $t('storage.delete.selectedFiles') }}</span>
        </n-tooltip>

        <!-- Separator -->
        <n-divider class="h-full mx-4" vertical />
      </template>

      <!-- Refresh directory content -->
      <n-button size="small" @click="refreshDirectoryContent">
        <span class="icon-refresh text-lg mr-2"></span>
        {{ $t('storage.refresh') }}
      </n-button>

      <!-- Create folder -->
      <n-button size="small" @click="showModalNewFolder = true">
        <span class="icon-create-folder text-lg mr-2"></span>
        {{ $t('storage.directory.create') }}
      </n-button>

      <!-- Upload files -->
      <n-button
        size="small"
        :color="dataStore.folder.uploadActive ? colors.primary : ''"
        ghost
        @click="dataStore.folder.uploadActive = !dataStore.folder.uploadActive"
      >
        <span class="icon-upload text-lg mr-2"></span>
        {{ $t('general.upload') }}
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create new folder -->
  <modal v-model:show="showModalNewFolder" :title="$t('storage.directory.createNew')">
    <FormStorageDirectory @submit-success="onFolderCreated" />
  </modal>

  <!-- Modal - Delete file/folder -->
  <ModalDelete v-model:show="showModalDelete" :title="$t(`storage.delete.bucketItems`)">
    <template #content>
      <p class="text-body">
        {{ $t(`storage.delete.deleteConfirm`, { num: dataStore.folder.selectedItems.length }) }}
      </p>
    </template>
    <slot>
      <FormDeleteItems :items="dataStore.folder.selectedItems" @submit-success="onDeleted" />
    </slot>
  </ModalDelete>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import colors from '~~/tailwind.colors';

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
  dataStore.fetchDirectoryContent();
}

function onFolderCreated() {
  showModalNewFolder.value = false;

  /** Refresh directory content */
  dataStore.fetchDirectoryContent();
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

  await Promise.all(promises).then(_ => {
    downloading.value = false;
  });
}

/** Download file - get file details and download content from downloadLink */
async function downloadFile(CID?: string | null) {
  if (!CID) {
    console.warn('MISSING File CID!');
    return;
  }
  try {
    if (!(CID in dataStore.file.items)) {
      dataStore.file.items[CID] = await dataStore.fetchFileDetails(CID);
    }
    const fileDetails: FileDetails = dataStore.file.items[CID].file;
    return download(fileDetails.link, fileDetails.name);
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
function onDeleted() {
  showModalDelete.value = false;

  /** Reset selected items */
  dataStore.folder.selectedItems = [];

  setTimeout(() => {
    dataStore.fetchDirectoryContent();
  }, 300);
}
</script>
