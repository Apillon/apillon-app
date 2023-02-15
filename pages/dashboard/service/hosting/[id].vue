<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <!-- Actions -->
        <ActionsHostingWebsite />

        <!-- Upload files -->
        <FormHostingUploadWebsite :bucket-uuid="dataStore.bucketUuid" />

        <div>
          <!-- Breadcrumbs -->
          <div class="relative h-8">
            <StorageBreadcrumbs v-if="dataStore.folder.selected" class="absolute" />
          </div>
          <!-- DataTable: files and directories -->
          <transition name="fade" appear>
            <TableStorageFiles />
          </transition>
        </div>
      </n-space>
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
  const websiteId = parseInt(`${params?.id}`);
  dataStore.setWebsiteId(websiteId);

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const website = await dataStore.getWebsite(websiteId);

      /** Check of website exists */
      if (!website?.id) {
        router.push({ name: 'dashboard-service-hosting' });
        return;
      }
      /** Get deployments for this website */
      dataStore.getDeployments(websiteId);

      /** Show files from main bucket */
      dataStore.bucket.active = website.bucket;
      dataStore.setBucketId(website.bucket.id);

      if (website.bucket.uploadedSize === 0) {
        dataStore.bucket.uploadActive = true;
      }
      pageLoading.value = false;
    });
  }, 100);
});
</script>
