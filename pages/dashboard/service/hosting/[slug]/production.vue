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
          deploymentStore.production.length > 0
        "
      >
        <n-space class="pb-8" :size="32" vertical>
          <ActionsHostingWebpage :env="DeploymentEnvironment.PRODUCTION" />

          <!-- Domain preview -->
          <HostingDomain />

          <!-- IPNS link -->
          <HostingPreviewLink
            :link="webpageStore.active.ipnsProductionLink || ''"
            :title="$t('hosting.ipnsLink')"
          />

          <!-- Deployments -->
          <TableHostingDeployment :deployments="deploymentStore.production" />

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
            <p class="text-body">{{ $t('hosting.productionEmpty') }}</p>
          </div>
        </div>
      </template>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const bucketStore = useBucketStore();
const webpageStore = useWebpageStore();
const deploymentStore = useDeploymentStore();
const { pageLoading, initWebpage } = useHosting();

useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(() => {
  initWebpage(DeploymentEnvironment.PRODUCTION);
});
</script>
