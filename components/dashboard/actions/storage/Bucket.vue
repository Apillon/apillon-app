<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="bucketStore.folder.search"
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
      <template v-if="bucketStore.folder.selectedItems.length > 0">
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
        <span class="icon-refresh text-xl mr-2"></span>
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
        :color="bucketStore.uploadActive ? colors.primary : ''"
        type="primary"
        ghost
        @click="bucketStore.uploadActive = !bucketStore.uploadActive || !bucketStore.hasBucketItems"
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
        {{ $t(`storage.delete.deleteConfirm`, { num: bucketStore.folder.selectedItems.length }) }}
      </p>
    </template>
    <slot>
      <FormDeleteItems :items="bucketStore.folder.selectedItems" @submit-success="onDeleted" />
    </slot>
  </ModalDelete>
</template>

<script lang="ts" setup>
import colors from '~~/tailwind.colors';

const { downloadFile } = useFile();
const bucketStore = useBucketStore();

const downloading = ref<boolean>(false);
const showModalNewFolder = ref<boolean>(false);
const showModalDelete = ref<boolean>(false);
const showPopoverDelete = ref<boolean>(false);
const showPopoverDownload = ref<boolean>(false);

/** Refresh directory content */
function refreshDirectoryContent() {
  bucketStore.fetchDirectoryContent();
}

function onFolderCreated() {
  showModalNewFolder.value = false;

  /** Refresh directory content */
  bucketStore.fetchDirectoryContent();
}

/**
 * Download
 */
async function downloadSelectedFiles() {
  if (bucketStore.folder.selectedItems.length === 0) {
    showPopoverDownload.value = true;

    setTimeout(() => {
      showPopoverDownload.value = false;
    }, 3000);
    return;
  }

  const promises: Array<Promise<any>> = [];
  downloading.value = true;

  bucketStore.folder.selectedItems.forEach(async item => {
    const req = downloadFile(item.CID);
    promises.push(req);
    await req;
  });

  await Promise.all(promises).then(_ => {
    downloading.value = false;
  });
}

/**
 * Delete
 */
function deleteSelectedFiles() {
  if (bucketStore.folder.selectedItems.length === 0) {
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
  bucketStore.folder.selectedItems = [];

  setTimeout(() => {
    bucketStore.fetchDirectoryContent();
  }, 300);
}
</script>
