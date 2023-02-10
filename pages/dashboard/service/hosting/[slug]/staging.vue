<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebpage />
    </template>
    <slot>
      <template
        v-if="
          bucketStore.folder.items.length ||
          bucketStore.active.CID ||
          deploymentStore.staging.length > 0
        "
      >
        <n-space class="pb-8" :size="32" vertical>
          <ActionsHostingWebpage :env="DeploymentEnvironment.STAGING" />

          <!-- IPNS link -->
          <HostingPreviewLink
            :link="webpageStore.active.ipnsStagingLink || ''"
            :title="$t('hosting.ipnsLink')"
          />

          <!-- IPNS address
          <HostingPreviewLink
            :link="bucketStore.active.IPNS || ''"
            :title="$t('hosting.ipns')"
            copy
          /> -->

          <!-- Deployments -->
          <TableHostingDeployment :deployments="deploymentStore.staging" />

          <!-- Breadcrumbs -->
          <div>
            <div class="relative h-8">
              <StorageBreadcrumbs v-if="bucketStore.folder.selected" class="absolute" />
            </div>
            <TableStorageFiles :actions="false" />
          </div>
        </n-space>
      </template>
      <template v-else>
        <div
          class="flex flex-col items-center justify-center px-6 py-4"
          style="min-height: calc(100vh - 270px)"
        >
          <div class="mb-4">
            <NuxtIcon name="storage/empty" class="icon-auto" filled />
          </div>
          <div class="mb-10 text-center">
            <h3 class="font-bold">{{ $t('general.nothingHere') }}</h3>
            <p class="text-body">{{ $t('hosting.stagingEmpty') }}</p>
          </div>
        </div>
      </template>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const router = useRouter();
const { params } = useRoute();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const webpageStore = useWebpageStore();
const deploymentStore = useDeploymentStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(() => {
  /** Webpage ID from route, then load buckets */
  const webpageId = parseInt(`${params?.slug}`);
  webpageStore.setWebpageId(webpageId);

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const webpage = await webpageStore.getWebpage(webpageId);

      /** Check of webpage exists */
      if (!webpage?.id) {
        router.push({ name: 'dashboard-service-hosting' });
        return;
      }
      /** Get deployments for this webpage */
      deploymentStore.getDeployments(webpageId, DeploymentEnvironment.STAGING);

      /** Show files from staging bucket */
      bucketStore.active = webpage.stagingBucket;
      bucketStore.setBucketId(webpage.stagingBucket.id);

      if (webpage.bucket.uploadedSize === 0) {
        bucketStore.uploadActive = true;
      }
      pageLoading.value = false;
    });
  }, 100);
});
</script>
