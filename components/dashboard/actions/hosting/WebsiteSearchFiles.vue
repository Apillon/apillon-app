<template>
  <div class="w-[20vw] min-w-[11rem] max-w-xs">
    <FormFieldSearch v-model:value="bucketStore.folder.search" />
  </div>
</template>

<script lang="ts" setup>
const bucketStore = useBucketStore();
</script>
