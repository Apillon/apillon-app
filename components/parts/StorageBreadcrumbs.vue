<template>
  <div>
    <button class="p-1 mr-2" @click="goToParentFolder()">
      <span class="icon-back text-lg"></span>
    </button>
    <template v-for="(folderPath, key) in dataStore.folder.path">
      <span v-if="key === dataStore.folder.path.length - 1">
        {{ folderPath.name }}
      </span>
      <span v-else class="cursor-pointer" @click="goToFolder(folderPath.id)">
        {{ folderPath.name }}/
      </span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const dataStore = useDataStore();

/** Go to parent folder, if we are current in first level subfolder, than go to root folder */
function goToParentFolder() {
  if (dataStore.folder.path.length > 1) {
    const parentFolder = dataStore.folder.path.slice(-2)[0];
    goToFolder(parentFolder.id);
  } else {
    goToFolder(0);
  }
}

function goToFolder(parentFolderId?: number | undefined) {
  /** Select parent directory or root directory */
  dataStore.setFolderId(parentFolderId || 0);

  /** Refresh folder path */
  if (parentFolderId === 0 || parentFolderId === undefined) {
    dataStore.folder.path = [];
  } else {
    const pathItemIndex = dataStore.folder.path.findIndex(item => item.id === parentFolderId);
    dataStore.folder.path = dataStore.folder.path.slice(0, pathItemIndex + 1);
  }

  /** Reset search string and refesh folders */
  dataStore.folderSearch();
  dataStore.fetchDirectoryContent($i18n);
}
</script>
