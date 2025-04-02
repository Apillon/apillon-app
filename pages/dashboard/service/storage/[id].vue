<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderBucket />
    </template>

    <slot>
      <!-- Actions -->
      <ActionsStorageBucket class="mb-4" />

      <!-- Upload files -->
      <transition name="fade" appear>
        <FormStorageDragAndDrop v-if="bucketStore.uploadActive || !bucketStore.hasBucketItems" />
      </transition>

      <!-- Breadcrumbs -->
      <div v-if="bucketStore.hasBucketItems" class="relative mb-1 h-14 pt-2">
        <StorageBreadcrumbs v-if="bucketStore.folder.selected" class="absolute" />
      </div>

      <!-- DataTable: files and directories -->
      <transition name="fade" appear>
        <TableStorageFiles v-if="bucketStore.hasBucketItems" :type="bucketStore.active.bucketType" />
      </transition>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const bucketStore = useBucketStore();
const { pageLoading, initBucket } = useStorage();

useHead({
  title: t('dashboard.nav.storage'),
});

onMounted(() => {
  initBucket(true);
});
</script>
