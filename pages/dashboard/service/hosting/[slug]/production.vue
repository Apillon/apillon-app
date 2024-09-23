<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>
    <slot>
      <template v-if="bucketStore.folder.items.length || deploymentStore.production.length > 0">
        <n-space class="pb-8" :size="32" vertical>
          <div class="relative mb-4">
            <!-- Action: refresh -->
            <ActionsHostingWebsite
              class="absolute top-0 right-0"
              :env="DeploymentEnvironment.PRODUCTION"
              :search="false"
            />
            <div
              v-if="!websiteStore.active?.domain"
              class="flex gap-6 w-full items-end flex-wrap md:flex-nowrap pt-4"
            >
              <div class="w-4/6 max-w-md lg:max-w-xl xl:max-w-2xl">
                <!-- IPNS link -->
                <HostingPreviewLink
                  :link="websiteStore.active.w3ProductionLink || ''"
                  :title="$t('hosting.ipnsLink')"
                  :info="$t('hosting.ipnsInfo')"
                />
              </div>

              <!-- Generate short URL -->
              <FormStorageShortUrl
                v-if="websiteStore.active.w3ProductionLink"
                :target-url="websiteStore.active.w3ProductionLink"
                class="mb-[3px]"
                size="small"
              />
            </div>
          </div>

          <!-- Domain preview -->
          <HostingDomain />

          <!-- Deployments -->
          <TableHostingDeployment :deployments="deploymentStore.production" />

          <!-- Breadcrumbs -->
          <div class="mt-8">
            <ActionsHostingWebsiteSearchFiles />

            <div class="relative h-14 pt-2 mb-1">
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
