<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebpage />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <!-- Actions -->
        <ActionsHostingWebpage />

        <!-- Upload files -->
        <FormHostingUploadWebpage :bucket-uuid="dataStore.bucketUuid" />

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
  const webpageId = parseInt(`${params?.id}`);
  dataStore.setWebpageId(webpageId);

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const webpage = await dataStore.getWebpage(webpageId);

      /** Check of webpage exists */
      if (!webpage?.id) {
        router.push({ name: 'dashboard-service-hosting' });
        return;
      }
      /** Get deployments for this webpage */
      dataStore.getDeployments(webpageId);

      /** Show files from main bucket */
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
