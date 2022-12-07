<template v-if="dataStore.currentFolder">
  <div>
    <button
      class="p-1 mr-2"
      @click="goToParentFolder(dataStore.currentFolder.parentDirectoryId || 0)"
    >
      <span class="icon-back text-lg"></span>
    </button>
    <StorageBreadcrumb
      v-if="dataStore.currentFolder.parentDirectoryId"
      :folder-id="dataStore.currentFolder.parentDirectoryId"
      @breadcrumb-select="goToParentFolder"
    />
    <span v-if="dataStore.currentFolder.id">{{ dataStore.currentFolder.name }}/</span>
    <span v-else class="cursor-pointer" @click="goToParentFolder(0)">
      {{ $t('storage.goToRootDirectory') }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const dataStore = useDataStore();

function goToParentFolder(parentFolderId?: number | undefined) {
  /** Select parent directory or root directory */
  dataStore.setFolderId(parentFolderId || 0);

  /** Reset search string and refesh folders */
  dataStore.folder.search = '';
  dataStore.fetchDirectoryContent($i18n);
}
</script>
