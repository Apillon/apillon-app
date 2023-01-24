<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="dataStore.bucket.search"
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
      <template v-if="dataStore.bucket.selectedItems.length > 0">
        <!-- Delete files -->
        <n-tooltip placement="bottom" :show="showPopoverDelete">
          <template #trigger>
            <n-button class="w-10" size="small" :active="true" @click="emit('onBucketDelete')">
              <span class="icon-delete text-pink"></span>
            </n-button>
          </template>
          <span>{{ $t('storage.deleteSelectedFiles') }}</span>
        </n-tooltip>

        <!-- Separator -->
        <n-divider class="h-full mx-4" vertical />
      </template>

      <!-- Refresh storage content -->
      <n-button size="small" :loading="dataStore.bucket.loading" @click="refresh">
        <span class="icon-refresh text-lg mr-2"></span>
        {{ $t('storage.refresh') }}
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
const showModalDelete = ref<boolean>(false);
const showPopoverDelete = ref<boolean>(false);
const emit = defineEmits(['onBucketDelete']);

/** Refresh directory content */
async function refresh() {
  dataStore.promises.buckets = await dataStore.fetchBuckets();
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
  await dataStore.fetchDirectoryContent();
  showModalDelete.value = false;
}
</script>
