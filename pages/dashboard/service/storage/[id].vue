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
      <div v-if="bucketStore.hasBucketItems" class="relative h-12 py-2 mb-1">
        <StorageBreadcrumbs v-if="bucketStore.folder.selected" class="absolute" />
      </div>

      <!-- DataTable: files and directories -->
      <transition name="fade" appear>
        <TableStorageFiles v-if="bucketStore.hasBucketItems" />
      </transition>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const { params } = useRoute();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const pageLoading = ref<boolean>(true);
const bucketId = ref<number>(parseInt(`${params?.id}`));

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  /** Bucket ID from route, then load buckets */
  bucketStore.onBucketMounted(bucketId.value);

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      bucketStore.active = await bucketStore.getBucket(bucketId.value);

      if (!bucketStore.hasBucketItems || isCacheExpired(LsCacheKeys.BUCKET_ITEMS)) {
        await bucketStore.fetchDirectoryContent();
      }
      if (!bucketStore.hasBucketItems) {
        bucketStore.uploadActive = true;
      }
      pageLoading.value = false;
    });
  }, 100);
});
</script>
