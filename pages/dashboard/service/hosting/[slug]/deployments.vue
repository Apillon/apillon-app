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
          :config-id="deploymentStore.deploymentConfig?.id"
          @submit-success="modalCreateKeyVisible = false"
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
const { pageLoading, initWebsite } = useHosting();
const modalCreateKeyVisible = ref<boolean>(false);

useHead({
  title: t('dashboard.nav.hosting'),
});

onMounted(async () => {
  initWebsite(DeploymentEnvironment.STAGING, true, false, true);
  storageStore.getGithubProjectConfig();
});

const refreshBuilds = async () => {
  const websiteUuid = websiteStore.active?.website_uuid;
  if (websiteUuid) {
    await deploymentStore.fetchBuilds(websiteUuid);
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
    repoUrl: '',
  };
  modalCreateKeyVisible.value = true;
};
</script>
