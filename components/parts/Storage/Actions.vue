<template>
  <n-space justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="dataStore.folder.search"
        type="text"
        name="search"
        size="small"
        class="bg-grey-dark"
        placeholder="Search files"
      />
    </div>
    <n-space>
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
</template>

<script lang="ts" setup>
import colors from '~~/tailwind.colors';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const dataStore = useDataStore();
const showModalNewFolder = ref<boolean>(false);
const showPopoverDelete = ref<boolean>(false);
const showPopoverDownload = ref<boolean>(false);

function onFolderCreated() {
  showModalNewFolder.value = false;

  /** Refresh directory content */
  dataStore.fetchDirectoryContent($i18n);
}

function downloadSelectedFiles() {
  if (dataStore.folder.selectedItems.length === 0) {
    showPopoverDownload.value = true;

    setTimeout(() => {
      showPopoverDownload.value = false;
    }, 3000);
    return;
  }
  // TODO: Download files
  console.log(dataStore.folder.selectedItems);
}

function deleteSelectedFiles() {
  if (dataStore.folder.selectedItems.length === 0) {
    showPopoverDelete.value = true;

    setTimeout(() => {
      showPopoverDelete.value = false;
    }, 3000);
    return;
  }
  // TODO: Delete files
  console.log(dataStore.folder.selectedItems);
}
</script>
