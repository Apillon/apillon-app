<template>
  <!-- Upload files -->
  <FormHostingUploadWebsite :bucket-uuid="bucketStore.bucketUuid" />

  <div>
    <!-- Breadcrumbs -->
    <div class="relative mb-1 h-14 pt-2">
      <StorageBreadcrumbs v-if="bucketStore.folder.selected" class="absolute" />
    </div>
    <!-- DataTable: files and directories -->
    <transition name="fade" appear>
      <TableStorageFiles :type="TableFilesType.HOSTING" />
    </transition>
  </div>
</template>

<script lang="ts" setup>
const bucketStore = useBucketStore();
const { changeEnv } = useHosting();

onMounted(() => {
  changeEnv();
});
</script>
