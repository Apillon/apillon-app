<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <StorageHeading />
    </template>

    <slot>
      <!-- Actions -->
      <StorageActions class="mb-4" />

      <!-- Upload files -->
      <transition name="fade" appear>
        <FormStorageUploadFiles
          v-if="dataStore.folder.uploadActive"
          :bucketUuid="dataStore.bucket.active.bucket_uuid || dataStore.currentBucket.bucket_uuid"
          class=""
        />
      </transition>

      <!-- Breadcrumbs -->
      <StorageBreadcrumbs v-if="dataStore.folder.selected" />

      <!-- DataTable: files and directories -->
      <transition name="fade" appear>
        <TableFiles v-if="dataStore.bucket.active?.size" />
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

  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await dataStore.fetchBucket(parseInt(`${params?.id}`));

    if (!dataStore.bucket.active.size) {
      dataStore.folder.uploadActive = true;
    }
    pageLoading.value = false;
  });
});
</script>
