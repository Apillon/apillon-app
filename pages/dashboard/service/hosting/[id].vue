<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>

    <n-space class="pb-8" :size="32" vertical>
      <div class="flex gap-6">
        <div class="card-light flex-1 rounded-lg px-6 py-4">
          <HostingWebsiteInfo />
        </div>

        <div class="card max-w-64 px-6 py-4">
          <h6 class="mb-2">{{ $t('general.quickActions') }}</h6>
          <ActionsHostingWebsite />
        </div>
      </div>

      <n-tabs
        ref="tabsRef"
        v-model:value="activeTab"
        type="line"
        class="min-h-64"
        :class="`n-tabs-${tabsRef?.renderNameListRef?.value?.length || 0}`"
        animated
      >
        <template v-if="websiteStore.isActiveWebsiteStatic">
          <n-tab-pane :name="tabs.UPLOAD">
            <HostingWebsiteTabUpload />
          </n-tab-pane>
          <n-tab-pane :name="tabs.PRODUCTION">
            <HostingWebsiteTabProduction />
          </n-tab-pane>
        </template>
        <n-tab-pane v-else :name="tabs.DEPLOYMENTS">
          <h4 class="mb-6">{{ $t('hosting.website.branchDeployments') }}</h4>
          <TableHostingDeploymentBuilds :deployments="deploymentStore.builds" />
        </n-tab-pane>
        <n-tab-pane v-if="websiteStore.isActiveWebsiteGithubSource" :name="tabs.VARIABLES">
          <TableHostingDeploymentVariables v-if="configId" :config-id="configId" />
        </n-tab-pane>
      </n-tabs>
    </n-space>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();
const { activeTab, tabs, pageLoading, initWebsite, checkUnfinishedBuilds } = useHosting();
const tabsRef = ref();

useHead({
  title: t('dashboard.nav.hosting'),
});

onMounted(async () => {
  initWebsite();
  storageStore.getStorageInfo();
  storageStore.getGithubProjectConfig();

  if (configId.value || !websiteStore.isActiveWebsiteStatic) {
    checkUnfinishedBuilds();
  }
});

const configId = computed(() => {
  return deploymentStore.deploymentConfig?.id;
});
</script>
