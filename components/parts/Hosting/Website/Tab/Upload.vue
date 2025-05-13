<template>
  <div class="flex flex-col gap-4">
    <!-- Upload files -->
    <FormHostingUploadWebsite :bucket-uuid="bucketStore.bucketUuid" />

    <div class="flex items-center justify-between">
      <!-- Breadcrumbs -->
      <div class="relative min-h-12">
        <StorageBreadcrumbs v-if="bucketStore.folder.selected" />
      </div>
      <n-space size="large">
        <!-- Show only if user select files -->
        <template v-if="bucketStore.folder.selectedItems.length > 0">
          <!-- Delete files -->
          <n-tooltip placement="bottom" :show="showPopoverDelete">
            <template #trigger>
              <n-button
                class="w-10 !px-2"
                type="error"
                :disabled="authStore.isAdmin()"
                ghost
                @click="deleteSelectedFiles"
              >
                <span class="icon-delete text-xl"></span>
              </n-button>
            </template>
            <span>{{ $t('storage.delete.selectedFiles') }}</span>
          </n-tooltip>

          <!-- Separator -->
          <n-divider class="mx-4 h-full" vertical />
        </template>

        <!-- Clear all files -->
        <n-button type="error" :disabled="authStore.isAdmin()" ghost @click="showModalClearAll = true">
          <span class="icon-delete mr-2 text-xl"></span>
          {{ $t('hosting.clearAll') }}
        </n-button>
      </n-space>
    </div>

    <!-- DataTable: files and directories -->
    <transition name="fade" appear>
      <TableStorageFiles :type="TableFilesType.HOSTING" />
    </transition>

    <!-- Modal - Create new folder -->
    <modal v-model:show="showModalNewFolder" :title="$t('storage.directory.createNew')">
      <FormStorageDirectory @submit-success="onFolderCreated" />
    </modal>

    <!-- Modal - Delete file/folder -->
    <ModalDelete v-model:show="showModalDelete" :title="$t(`storage.delete.bucketItems`)">
      <template #content>
        <p>
          {{ $t(`storage.delete.deleteConfirm`, { num: bucketStore.folder.selectedItems.length }) }}
        </p>
      </template>
      <slot>
        <FormDeleteItems :items="bucketStore.folder.selectedItems" @submit-success="onDeleted" />
      </slot>
    </ModalDelete>

    <!-- Modal - Clear all files -->
    <ModalDelete v-model:show="showModalClearAll" :title="$t(`hosting.clearAllFiles`)">
      <template #content>
        <p v-if="$te(`hosting.clearAllWarn`)" class="text-body">
          {{ $t(`hosting.clearAllWarn`) }}
        </p>
      </template>
      <slot>
        <FormDelete :id="bucketStore.active.bucket_uuid" type="bucketContent" @submit-success="onAllFilesDeleted" />
      </slot>
    </ModalDelete>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const bucketStore = useBucketStore();
const { changeEnv } = useHosting();

const showModalNewFolder = ref<boolean>(false);
const showModalClearAll = ref<boolean>(false);
const showModalDelete = ref<boolean>(false);
const showPopoverDelete = ref<boolean>(false);

onMounted(() => {
  changeEnv();
});

function onFolderCreated() {
  showModalNewFolder.value = false;

  /** Refresh directory content */
  bucketStore.fetchDirectoryContent();
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

/** On all files deleted, refresh folder list */
function onAllFilesDeleted() {
  showModalClearAll.value = false;

  bucketStore.folder.items = [];
  bucketStore.folder.path = [];
  bucketStore.folder.selected = '';
  bucketStore.folderSearch();
}
</script>
