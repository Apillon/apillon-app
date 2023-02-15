<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>
    <slot>
      <template
        v-if="
          dataStore.folder.items.length ||
          dataStore.bucket.active.CID ||
          dataStore.website.deployment.production.length > 0
        "
      >
        <n-space class="pb-8" :size="32" vertical>
          <ActionsHostingWebsite :env="DeploymentEnvironment.PRODUCTION" />

          <!-- Domain preview -->
          <HostingDomain />

          <!-- IPNS link -->
          <HostingPreviewLink
            :link="dataStore.website.active.ipnsProductionLink || ''"
            :title="$t('hosting.ipnsLink')"
          />

          <!-- Deployments -->
          <TableHostingDeployment :deployments="dataStore.website.deployment.production" />

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
            <p class="text-body">{{ $t('hosting.productionEmpty') }}</p>
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

const websiteId = ref<number>(parseInt(`${params?.slug}`));
const pageLoading = ref<boolean>(true);

let deploymentInterval: any = null as any;
useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(() => {
  /** Website ID from route, then load buckets */
  dataStore.setWebsiteId(websiteId.value);

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const website = await dataStore.getWebsite(websiteId.value);

      /** Check of website exists */
      if (!website?.id) {
        router.push({ name: 'dashboard-service-hosting' });
        return;
      }

      /** Get deployments for this website */
      await dataStore.getDeployments(websiteId.value);
      checkUnfinishedDeployments();

      /** Show files from production bucket */
      dataStore.bucket.active = website.productionBucket;
      dataStore.setBucketId(website.productionBucket.id);

      dataStore.fetchDirectoryContent(website.productionBucket.bucket_uuid);

      if (website.bucket.uploadedSize === 0) {
        dataStore.bucket.uploadActive = true;
      }
      pageLoading.value = false;
    });
  }, 100);
});

onUnmounted(() => {
  clearInterval(deploymentInterval);
});

function checkUnfinishedDeployments() {
  const unfinishedDeployment = dataStore.website.deployment.production.find(
    deployment => deployment.deploymentStatus < DeploymentStatus.SUCCESSFUL
  );
  if (unfinishedDeployment === undefined) {
    return;
  }

  deploymentInterval = setInterval(async () => {
    const deployment = await dataStore.fetchDeployment(
      dataStore.website.active.id,
      unfinishedDeployment.id
    );
    if (unfinishedDeployment.deploymentStatus !== deployment.deploymentStatus) {
      unfinishedDeployment.deploymentStatus = deployment.deploymentStatus;
    }
    if (deployment.deploymentStatus >= DeploymentStatus.SUCCESSFUL) {
      unfinishedDeployment.size = deployment.size;
      clearInterval(deploymentInterval);
    }
  }, 10000);
}
</script>
