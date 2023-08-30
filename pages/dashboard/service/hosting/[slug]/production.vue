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
          deploymentStore.production.length > 0
        "
      >
        <n-space class="pb-8" :size="32" vertical>
          <ActionsHostingWebsite :env="DeploymentEnvironment.PRODUCTION" />

          <!-- Domain preview -->
          <HostingDomain />

          <!-- IPNS link -->
          <HostingPreviewLink
            :link="
              websiteStore.active.w3ProductionLink || websiteStore.active.ipnsProductionLink || ''
            "
            :title="$t('hosting.ipnsLink')"
          />

          <!-- Deployments -->
          <TableHostingDeployment :deployments="deploymentStore.production" />

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
        :info="$t('hosting.productionEmpty')"
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
  initWebsite(DeploymentEnvironment.PRODUCTION);
});
</script>
