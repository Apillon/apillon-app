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

      <n-tabs v-model:value="tab" type="line" class="min-h-64" animated>
        <template v-if="websiteStore.isActiveWebsiteStatic">
          <n-tab-pane :name="Tabs.UPLOAD">
            <!-- Upload files -->
            <FormHostingUploadWebsite :bucket-uuid="bucketStore.bucketUuid" />

            <div>
              <!-- Breadcrumbs -->
              <div class="relative mb-1 h-14 pt-2">
                <StorageBreadcrumbs v-if="bucketStore.folder.selected" class="absolute" />
              </div>
              <!-- DataTable: files and directories -->
              <transition name="fade" appear>
                <TableStorageFiles :type="TableFilesType.HOSTING" />
              </transition>
            </div>
          </n-tab-pane>
          <n-tab-pane v-if="websiteStore.isActiveWebsiteStatic" :name="Tabs.PRODUCTION">
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
          </n-tab-pane>
        </template>
        <n-tab-pane v-else :name="Tabs.DEPLOYMENTS">
          <n-space v-if="storageStore.projectConfig" class="pb-8" :size="32" vertical>
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
          <Empty v-else :title="$t('general.nothingHere')" :info="$t('hosting.deploy.infoEmpty')" icon="storage/empty">
            <Btn type="primary" @click="modalGithubVisible = true">{{ $t('hosting.deploy.connectRepo') }}</Btn>
          </Empty>
        </n-tab-pane>
        <n-tab-pane v-if="websiteStore.isActiveWebsiteGithubSource" :name="Tabs.VARIABLES">
          <TableHostingDeploymentVariables :variables="deploymentStore.variables" />
        </n-tab-pane>
      </n-tabs>
    </n-space>

    <modal
      v-model:show="modalGithubVisible"
      :title="$t(websiteStore.isActiveWebsiteGithubSource ? 'hosting.deploy.update' : 'hosting.deploy.new')"
    >
      <FormStorageDeployConfig
        :config-id="deploymentStore.deploymentConfig?.id"
        @submit-success="handleSubmitSuccess"
      />
    </modal>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const bucketStore = useBucketStore();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();
const { pageLoading, initWebsite, checkUnfinishedBuilds } = useHosting();
const modalGithubVisible = ref<boolean>(false);

useHead({
  title: t('dashboard.nav.hosting'),
});

const Tabs = {
  UPLOAD: t('hosting.menu.preview'),
  DEPLOYMENTS: t('hosting.menu.deployments'),
  PRODUCTION: t('hosting.menu.production'),
  VARIABLES: t('hosting.menu.envVars'),
};
const tab = ref(websiteStore.isActiveWebsiteStatic ? Tabs.UPLOAD : Tabs.DEPLOYMENTS);

onMounted(async () => {
  initWebsite(DeploymentEnvironment.STAGING, true, false, true);
  storageStore.getStorageInfo();
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
</script>
