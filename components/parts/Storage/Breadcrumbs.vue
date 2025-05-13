<template>
  <n-scrollbar v-if="bucketStore.folder.path.length > 0" x-scrollable style="max-width: 100%">
    <div class="card-dark flex flex-nowrap items-center whitespace-nowrap rounded-lg p-2">
      <button class="mr-2 px-1" @click="goToParentFolder()">
        <span class="icon-back align-sub text-2xl"></span>
      </button>
      <button class="font-bold" @click="goToFolder()">{{ bucketStore.active.name }}:&nbsp;</button>
      <span v-for="(folderPath, key) in bucketStore.folder.path" :key="key">
        <span v-if="key === bucketStore.folder.path.length - 1">
          {{ folderPath.name }}
        </span>
        <span v-else class="cursor-pointer" @click="goToFolder(folderPath.uuid)">
          <span>{{ folderPath.name }}</span>
          <span class="mx-[1px] inline-block">/</span>
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
    goToFolder(parentFolder.uuid);
  } else {
    goToFolder();
  }
}

function goToFolder(parentFolderUuid?: string) {
  /** Select parent directory or root directory */
  bucketStore.folder.selected = parentFolderUuid || '';

  /** Refresh folder path */
  if (!parentFolderUuid) {
    bucketStore.folder.path = [];
  } else {
    const pathItemIndex = bucketStore.folder.path.findIndex(item => item.uuid === parentFolderUuid);
    bucketStore.folder.path = bucketStore.folder.path.slice(0, pathItemIndex + 1);
  }

  /** Reset search string and refresh folders */
  bucketStore.folderSearch();
  bucketStore.fetchDirectoryContent();
}
</script>
