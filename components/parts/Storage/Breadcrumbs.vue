<template>
  <n-scrollbar v-if="bucketStore.folder.path.length > 0" x-scrollable style="max-width: 100%">
    <div class="flex flex-nowrap items-center">
      <button class="px-1 mr-2" @click="goToParentFolder()">
        <span class="icon-back text-2xl align-sub"></span>
      </button>
      <span
        v-for="(folderPath, key) in bucketStore.folder.path"
        :key="key"
        class="whitespace-nowrap"
      >
        <span v-if="key === bucketStore.folder.path.length - 1">
          {{ folderPath.name }}
        </span>
        <span v-else class="cursor-pointer" @click="goToFolder(folderPath.id)">
          <span>{{ folderPath.name }}</span>
          <span class="inline-block mx-[1px]">/</span>
        </span>
      </span>
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup>
const bucketStore = useBucketStore();

/** Go to parent folder, if we are current in first level subfolder, than go to root folder */
function goToParentFolder() {
  if (bucketStore.folder.path.length > 1) {
    const parentFolder = bucketStore.folder.path.slice(-2)[0];
    goToFolder(parentFolder.id);
  } else {
    goToFolder(0);
  }
}

function goToFolder(parentFolderId?: number | undefined) {
  /** Select parent directory or root directory */
  bucketStore.folder.selected = parentFolderId || 0;

  /** Refresh folder path */
  if (parentFolderId === 0 || parentFolderId === undefined) {
    bucketStore.folder.path = [];
  } else {
    const pathItemIndex = bucketStore.folder.path.findIndex(item => item.id === parentFolderId);
    bucketStore.folder.path = bucketStore.folder.path.slice(0, pathItemIndex + 1);
  }

  /** Reset search string and refesh folders */
  bucketStore.folderSearch();
  bucketStore.fetchDirectoryContent();
}
</script>
