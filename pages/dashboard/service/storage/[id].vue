<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <StorageHeading />
    </template>

    <slot>
      <!-- Actions -->
      <ActionsStorageBucket class="mb-4" />

      <!-- Upload files -->
      <transition name="fade" appear>
        <FormStorageDragAndDrop v-if="dataStore.bucket.uploadActive || !dataStore.hasBucketItems" />
      </transition>

      <!-- Breadcrumbs -->
      <div v-if="dataStore.hasBucketItems" class="relative h-12 py-2 mb-1">
        <StorageBreadcrumbs v-if="dataStore.folder.selected" class="absolute" />
      </div>

      <!-- DataTable: files and directories -->
      <transition name="fade" appear>
        <TableStorageFiles v-if="dataStore.hasBucketItems" />
      </transition>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const { params } = useRoute();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  /** Bucket ID from route, then load buckets */
  dataStore.onBucketMounted(parseInt(`${params?.id}`));

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await dataStore.getBucket(parseInt(`${params?.id}`));

      if (!dataStore.hasBucketItems || isCacheExpired(LsCacheKeys.BUCKET_ITEMS)) {
        await dataStore.fetchDirectoryContent();
      }
      if (!dataStore.hasBucketItems) {
        dataStore.bucket.uploadActive = true;
      }
      pageLoading.value = false;
    });
  }, 300);
});
</script>
