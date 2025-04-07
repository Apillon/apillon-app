<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>
    <slot>
      <template v-if="bucketStore.folder.items.length || deploymentStore.production.length > 0">
        <n-space class="pb-8" :size="32" vertical>
          <div class="relative">
            <!-- Action: refresh -->
            <ActionsHostingWebsite
              class="absolute right-0 top-0"
              :env="DeploymentEnvironment.PRODUCTION"
              :search="false"
            />
            <div v-if="!websiteStore.active?.domain" class="flex w-full flex-wrap items-end gap-6 pt-4 md:flex-nowrap">
              <div class="w-4/6 max-w-md lg:max-w-xl xl:max-w-2xl">
                <!-- IPNS link -->
                <HostingPreviewLink
                  :link="websiteStore.active.w3ProductionLink || ''"
                  :title="$t('hosting.ipfsLink')"
                  :info="$t('hosting.ipnsInfo')"
                />
              </div>
            </div>
          </div>

          <!-- Domain preview -->
          <HostingDomain />

          <!-- Deployments -->
          <TableHostingDeployment :deployments="deploymentStore.production" />

          <!-- Breadcrumbs -->
          <div class="mt-8">
            <ActionsHostingWebsiteSearchFiles />

            <div class="relative mb-1 h-14 pt-2">
              <StorageBreadcrumbs v-if="bucketStore.folder.selected" class="absolute" />
            </div>
            <TableStorageFiles :type="TableFilesType.DEPLOYMENT" />
          </div>
        </n-space>
      </template>
      <Empty v-else :title="$t('general.nothingHere')" :info="$t('hosting.productionEmpty')" icon="storage/empty" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const bucketStore = useBucketStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();
const { pageLoading, initWebsite } = useHosting();

useHead({
  title: t('dashboard.nav.hosting'),
});

onMounted(() => {
  initWebsite(DeploymentEnvironment.PRODUCTION);
});
</script>
