<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="bucketStore.folder.search" :placeholder="$t('storage.file.search')" />
    </div>

    <n-space size="large">
      <!-- Show only if user select files -->
      <template v-if="bucketStore.folder.selectedItems.length > 0">
        <!-- Download files -->
        <n-button class="w-10" size="small" :focus="true" :loading="downloading" @click="downloadSelectedFiles">
          <span class="icon-download text-xl"></span>
        </n-button>

        <!-- Delete files -->
        <n-tooltip placement="bottom" :show="showPopoverDelete">
          <template #trigger>
            <n-button class="w-10" size="small" type="error" ghost @click="deleteSelectedFiles">
              <span class="icon-delete text-xl"></span>
            </n-button>
          </template>
          <span>{{ $t('storage.delete.selectedFiles') }}</span>
        </n-tooltip>

        <!-- Separator -->
        <n-divider class="mx-4 h-full" vertical />
      </template>

      <!-- Refresh directory content -->
      <n-button size="small" @click="refreshDirectoryContent">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('storage.refresh') }}
      </n-button>

      <!-- Create folder -->
      <n-button size="small" :disabled="authStore.isAdmin()" @click="showModalNewFolder = true">
        <span class="icon-create-folder mr-2 text-xl"></span>
        {{ $t('storage.directory.create') }}
      </n-button>

      <!-- Upload files -->
      <n-button
        :color="bucketStore.uploadActive ? colors.primary : ''"
        size="small"
        type="primary"
        :disabled="authStore.isAdmin()"
        ghost
        @click="bucketStore.uploadActive = !bucketStore.uploadActive || !bucketStore.hasBucketItems"
      >
        <span class="icon-upload mr-2 text-xl"></span>
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
      <p>
        {{ $t(`storage.delete.deleteConfirm`, { num: bucketStore.folder.selectedItems.length }) }}
      </p>
    </template>
    <slot>
      <FormDeleteItems :items="bucketStore.folder.selectedItems" @submit-success="onDeleted" />
    </slot>
  </ModalDelete>
</template>

<script lang="ts" setup>
import { colors } from '~/tailwind.config';

const authStore = useAuthStore();
const bucketStore = useBucketStore();
const { downloading, downloadSelectedFiles } = useFile();

const showModalNewFolder = ref<boolean>(false);
const showModalDelete = ref<boolean>(false);
const showPopoverDelete = ref<boolean>(false);

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

    /** Remove timestamp for deleted items */
    sessionStorage.removeItem(LsCacheKeys.FILE_DELETED);
  }, 300);
}
</script>
