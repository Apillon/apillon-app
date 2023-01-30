<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HostingHeading />
    </template>

    <slot>
      <!-- Actions -->
      <HostingWebsiteActionsUpload class="mb-4" />

      <!-- Upload files -->
      <FormHostingUploadWebpage :bucket-uuid="dataStore.bucketUuid" />

      <!-- Breadcrumbs -->
      <div class="relative h-12 py-2 mb-1">
        <StorageBreadcrumbs v-if="dataStore.folder.selected" class="absolute" />
      </div>

      <!-- DataTable: files and directories -->
      <transition name="fade" appear>
        <TableStorageFiles :actions="false" />
      </transition>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const router = useRouter();
const { params } = useRoute();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(() => {
  /** Bucket ID from route, then load buckets */
  dataStore.setWebpageId(parseInt(`${params?.id}`));

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const webpage = await dataStore.getWebpage(parseInt(`${params?.id}`));

      /** Check of webpage exists */
      if (!webpage?.id) {
        router.push({ name: 'dashboard-service-hosting' });
        return;
      }

      dataStore.bucket.active = webpage.bucket;
      dataStore.setBucketId(webpage.bucket.id);

      if (webpage.bucket.uploadedSize === 0) {
        dataStore.bucket.uploadActive = true;
      }
      pageLoading.value = false;
    });
  }, 100);
});
</script>
