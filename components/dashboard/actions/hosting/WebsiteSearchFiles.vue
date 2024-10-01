<template>
  <div class="min-w-[11rem] w-[20vw] max-w-xs">
    <n-input
      v-model:value="bucketStore.folder.search"
      type="text"
      name="search"
      size="small"
      :placeholder="$t('storage.file.search')"
      clearable
    >
      <template #prefix>
        <span class="icon-search text-2xl"></span>
      </template>
    </n-input>
  </div>
</template>

<script lang="ts" setup>
const bucketStore = useBucketStore();
</script>
