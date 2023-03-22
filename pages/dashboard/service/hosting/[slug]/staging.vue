<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
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
          <ActionsHostingWebsite :env="DeploymentEnvironment.STAGING" />

          <!-- IPNS link -->
          <HostingPreviewLink
            :link="websiteStore.active.ipnsStagingLink || ''"
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
            <TableStorageFiles :type="TableFilesType.DEPLOYMENT" />
          </div>
        </n-space>
      </template>
      <Empty
        v-else
        :title="$t('general.nothingHere')"
        :info="$t('hosting.stagingEmpty')"
        icon="storage/empty"
      />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const bucketStore = useBucketStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();
const { pageLoading, initWebsite } = useHosting();

useHead({
  title: $i18n.t('dashboard.nav.hosting'),
});

onMounted(() => {
  initWebsite(DeploymentEnvironment.STAGING);
});
</script>
