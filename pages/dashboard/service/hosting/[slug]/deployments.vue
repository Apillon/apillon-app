<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>
    <slot>
      <template v-if="websiteStore.active.repoId">
        <n-space class="pb-8" :size="32" vertical>
          <div class="flex w-full flex-row-reverse justify-between gap-8">
            <!-- Actions : refresh, deploy -->
            <n-space>
              <n-button size="small" @click="navigateToEnvVars">
                {{ $t('hosting.deploy.env-vars.title') }}
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

      <modal v-model:show="modalCreateKeyVisible" :title="$t('hosting.deploy.new')">
        <FormStorageDeployConfig @submit-success="modalCreateKeyVisible = false" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const websiteStore = useWebsiteStore();
const storageStore = useStorageStore();
const deploymentStore = useDeploymentStore();
const router = useRouter();
const { pageLoading, initWebsite } = useHosting();
const modalCreateKeyVisible = ref<boolean>(false);

useHead({
  title: $i18n.t('dashboard.nav.hosting'),
});

onMounted(async () => {
  initWebsite(DeploymentEnvironment.STAGING, true);
  storageStore.getGithubProjectConfig();
});

const refreshBuilds = async () => {
  const websiteUuid = websiteStore.active?.website_uuid;
  if (websiteUuid) {
    await deploymentStore.fetchBuilds(websiteUuid);
  }
};

const navigateToEnvVars = () => {
  if (websiteStore.active.deploymentConfig_id) {
    router.push(
      `/dashboard/service/hosting/${websiteStore.active.website_uuid}/${websiteStore.active.deploymentConfig_id}/env-vars`
    );
  }
};
</script>
