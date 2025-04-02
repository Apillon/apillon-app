<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>
    <slot>
      <template v-if="bucketStore.folder.items.length || deploymentStore.staging.length > 0">
        <n-space class="pb-8" :size="32" vertical>
          <div class="flex w-full flex-col justify-between gap-8 xl:flex-row-reverse">
            <!-- Actions : refresh, deploy -->
            <ActionsHostingWebsite :env="DeploymentEnvironment.STAGING" :search="false" />

            <!-- IPNS link -->
            <HostingPreviewLink
              class="xl:max-w-3xl xxl:max-w-4xl"
              :link="websiteStore.active.w3StagingLink || ''"
              :title="$t('hosting.ipfsLink')"
              :info="$t('hosting.ipnsInfo')"
            />
          </div>

          <!-- Deployments -->
          <TableHostingDeployment :deployments="deploymentStore.staging" />

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
      <Empty v-else :title="$t('general.nothingHere')" :info="$t('hosting.stagingEmpty')" icon="storage/empty" />
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
  initWebsite(DeploymentEnvironment.STAGING);
});
</script>
