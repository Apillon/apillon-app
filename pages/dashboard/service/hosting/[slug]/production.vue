<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebpage />
    </template>
    <slot>
      <template
        v-if="
          dataStore.folder.items.length ||
          dataStore.bucket.active.CID ||
          dataStore.webpage.deployment.production.length > 0
        "
      >
        <n-space class="pb-8" :size="32" vertical>
          <ActionsHostingWebpage :env="DeploymentEnvironment.PRODUCTION" />

          <!-- Domain preview -->
          <HostingDomain />

          <!-- IPNS link -->
          <HostingPreviewLink
            :link="dataStore.webpage.active.ipnsProductionLink || ''"
            :title="$t('hosting.ipnsLink')"
          />

          <!-- Deployments -->
          <TableHostingDeployment :deployments="dataStore.webpage.deployment.production" />

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

const webpageId = ref<number>(parseInt(`${params?.slug}`));
const pageLoading = ref<boolean>(true);

let deploymentInterval: any = null as any;
useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(() => {
  /** Webpage ID from route, then load buckets */
  dataStore.setWebpageId(webpageId.value);

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const webpage = await dataStore.getWebpage(webpageId.value);

      /** Check of webpage exists */
      if (!webpage?.id) {
        router.push({ name: 'dashboard-service-hosting' });
        return;
      }

      /** Get deployments for this webpage */
      await dataStore.getDeployments(webpageId.value);
      checkUnfinishedDeployments();

      /** Show files from production bucket */
      dataStore.bucket.active = webpage.productionBucket;
      dataStore.setBucketId(webpage.productionBucket.id);

      dataStore.fetchDirectoryContent(webpage.productionBucket.bucket_uuid);

      if (webpage.bucket.uploadedSize === 0) {
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
  const unfinishedDeployment = dataStore.webpage.deployment.production.find(
    deployment => deployment.deploymentStatus < DeploymentStatus.SUCCESSFUL
  );
  if (unfinishedDeployment === undefined) {
    return;
  }

  deploymentInterval = setInterval(async () => {
    const deployment = await dataStore.fetchDeployment(
      dataStore.webpage.active.id,
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
