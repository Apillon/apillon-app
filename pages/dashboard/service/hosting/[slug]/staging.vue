<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HostingHeading />
    </template>
    <slot>
      <template
        v-if="
          dataStore.folder.items.length ||
          dataStore.bucket.active.CID ||
          dataStore.webpage.deployment.staging.length > 0
        "
      >
        <n-space class="pb-8" :size="32" vertical>
          <HostingWebsiteActions :env="DeploymentEnvironment.STAGING" />

          <!-- IPNS link -->
          <div v-if="dataStore.bucket.active.IPNS">
            <div class="body-sm mb-2">
              <strong>{{ $t('hosting.ipnsLink') }}</strong>
            </div>
            <a :href="previewLink" target="_blank">
              <n-space class="bg-bg-dark px-4 py-2" justify="space-between" align="center">
                <span>{{ previewLink }}</span>
                <span class="icon-preview text-xl align-middle"></span>
              </n-space>
            </a>
          </div>

          <!-- Deployments -->
          <TableHostingDeployment :deployments="dataStore.webpage.deployment.staging" />

          <!-- Breadcrumbs -->
          <div>
            <div class="relative h-8">
              <StorageBreadcrumbs v-if="dataStore.folder.selected" class="absolute" />
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
const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(() => {
  /** Webpage ID from route, then load buckets */
  const webpageId = parseInt(`${params?.slug}`);
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
      dataStore.getDeployments(webpageId, DeploymentEnvironment.STAGING);

      /** Show files from staging bucket */
      dataStore.bucket.active = webpage.stagingBucket;
      dataStore.setBucketId(webpage.stagingBucket_id);

      if (webpage.bucket.uploadedSize === 0) {
        dataStore.bucket.uploadActive = true;
      }
      pageLoading.value = false;
    });
  }, 100);
});

const previewLink = computed<string>(() => {
  return `https://ipfs.apillon.io/ipns/${dataStore.bucket.active.IPNS}`;
});
</script>
