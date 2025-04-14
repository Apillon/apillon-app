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
              <Btn size="small" type="primary" @click="triggerRedeploy" :loading="deploymentStore.deployLoading">
                {{ $t('hosting.deploy.redeploy') }}
              </Btn>
              <n-button v-if="websiteStore.isActiveWebsiteGithubSource" size="small" @click="showUpdateModal">
                {{ $t('hosting.deploy.update-config') }}
              </n-button>
              <n-button size="small" :loading="deploymentStore.buildsLoading" @click="refreshBuilds">
                <span class="icon-refresh mr-2 text-xl"></span>
                {{ $t('general.refresh') }}
              </n-button>
            </n-space>
          </div>

          <!-- Deployments -->
          <TableHostingDeploymentBuilds :deployments="deploymentStore.builds" />
        </n-space>
      </template>
      <Empty v-else :title="$t('general.nothingHere')" :info="$t('hosting.deploy.empty-info')" icon="storage/empty">
        <Btn type="primary" @click="modalCreateKeyVisible = true">{{ $t('hosting.deploy.connect-repo') }}</Btn>
      </Empty>

      <modal
        v-model:show="modalCreateKeyVisible"
        :title="$t(websiteStore.isActiveWebsiteGithubSource ? 'hosting.deploy.update' : 'hosting.deploy.new')"
      >
        <FormStorageDeployConfig
          @submit-success="handleSubmitSuccess"
          :config_id="deploymentStore.deploymentConfig?.id"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();
const storageStore = useStorageStore();
const { pageLoading, initWebsite, checkUnfinishedBuilds } = useHosting();
const modalCreateKeyVisible = ref<boolean>(false);
let refreshInterval: NodeJS.Timeout | undefined;

useHead({
  title: $i18n.t('dashboard.nav.hosting'),
});

onMounted(async () => {
  initWebsite(DeploymentEnvironment.STAGING, true, false, true);
  storageStore.getGithubProjectConfig();
  checkAndStartAutoRefresh();
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = undefined;
  }
});

const refreshBuilds = async () => {
  const websiteUuid = websiteStore.active?.website_uuid;
  if (websiteUuid) {
    await deploymentStore.fetchBuilds(websiteUuid);
  }
};

const handleSubmitSuccess = async () => {
  storageStore.resetDeployConfigForm();
  modalCreateKeyVisible.value = false;
  const existingDeploymentConfigId = deploymentStore.deploymentConfig?.id;
  await deploymentStore.getDeploymentConfig(websiteStore.active?.website_uuid);

  if (!existingDeploymentConfigId) {
    setTimeout(() => checkUnfinishedBuilds(), 3000);
  }
};

const triggerRedeploy = async () => {
  const websiteUuid = websiteStore.active?.website_uuid;
  if (websiteUuid) {
    await deploymentStore.redeploy(websiteUuid);
  }
};

const showUpdateModal = async () => {
  storageStore.deployConfigForm = {
    branchName: deploymentStore.deploymentConfig?.branchName || '',
    buildCommand: deploymentStore.deploymentConfig?.buildCommand || '',
    buildDirectory: deploymentStore.deploymentConfig?.buildDirectory || '',
    installCommand: deploymentStore.deploymentConfig?.installCommand || '',
    apiKey: deploymentStore.deploymentConfig?.apiKey || '',
    apiSecret: '',
    repoId: deploymentStore.deploymentConfig?.repoId || 0,
    repoName: deploymentStore.deploymentConfig?.repoName || '',
    repoOwnerName: deploymentStore.deploymentConfig?.repoOwnerName || '',
    repoUrl: deploymentStore.deploymentConfig?.repoUrl || '',
  };
  modalCreateKeyVisible.value = true;
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
