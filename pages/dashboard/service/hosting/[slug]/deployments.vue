<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>
    <slot>
      <template v-if="websiteStore.isActiveWebsiteGithubSource || websiteStore.active.nftCollectionUuid">
        <n-space class="pb-8" :size="32" vertical>
          <div class="flex w-full flex-row-reverse justify-between gap-8">
            <!-- Actions : refresh, deploy -->
            <n-space>
              <n-button v-if="websiteStore.isActiveWebsiteGithubSource" @click="showUpdateModal">
                {{ $t('hosting.deploy.updateConfig') }}
              </n-button>
              <n-button
                :loading="deploymentStore.buildsLoading"
                @click="deploymentStore.fetchBuilds(websiteStore.active.website_uuid)"
              >
                <span class="icon-refresh mr-2 text-xl"></span>
                {{ $t('general.refresh') }}
              </n-button>
            </n-space>
          </div>

          <!-- Deployments -->
          <TableHostingDeploymentBuilds :deployments="deploymentStore.builds" />
        </n-space>
      </template>
      <Empty v-else :title="$t('general.nothingHere')" :info="$t('hosting.deploy.infoEmpty')" icon="storage/empty">
        <Btn type="primary" @click="modalGithubVisible = true">{{ $t('hosting.deploy.connectRepo') }}</Btn>
      </Empty>

      <modal
        v-model:show="modalGithubVisible"
        :title="$t(websiteStore.isActiveWebsiteGithubSource ? 'hosting.deploy.update' : 'hosting.deploy.new')"
      >
        <FormStorageDeployConfig
          :config-id="deploymentStore.deploymentConfig?.id"
          @submit-success="handleSubmitSuccess"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();
const storageStore = useStorageStore();
const { pageLoading, initWebsite, checkUnfinishedBuilds } = useHosting();
const modalGithubVisible = ref<boolean>(false);
let refreshInterval: NodeJS.Timeout | undefined;

useHead({
  title: t('dashboard.nav.hosting'),
});

onMounted(async () => {
  initWebsite(DeploymentEnvironment.STAGING, true, false, true);
  storageStore.getGithubProjectConfig();
});

const hasGithubConnected = computed(() => {
  return !!websiteStore.isActiveWebsiteGithubSource || !!websiteStore.active.nftCollectionUuid;
});

const handleSubmitSuccess = async () => {
  websiteStore.resetForm();
  modalGithubVisible.value = false;

  setTimeout(() => checkUnfinishedBuilds(), 3000);
};

const showUpdateModal = async () => {
  if (deploymentStore.deploymentConfig) {
    Object.entries(deploymentStore.deploymentConfig).forEach(([key, value]) => {
      if (value && key in websiteStore.form) {
        websiteStore.form[key] = value;
      }
    });
  }
  modalGithubVisible.value = true;
};

const checkAndStartAutoRefresh = () => {
  const builds = deploymentStore.builds;
  const hasPendingBuilds = builds.some(build =>
    [DeploymentBuildStatus.IN_PROGRESS, DeploymentBuildStatus.PENDING].includes(build.buildStatus)
  );
  if (hasPendingBuilds && !refreshInterval) {
    refreshInterval = setInterval(async () => {
      await refreshBuilds();
    }, 5000);
  } else if (!hasPendingBuilds && refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = undefined;
  }
};

// Watch for changes in deploymentStore.builds
watch(
  () => deploymentStore.builds,
  () => {
    checkAndStartAutoRefresh();
  },
  { deep: true }
);
</script>
