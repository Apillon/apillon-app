<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>
    <slot>
      <TableHostingDeploymentVariables
        v-if="websiteStore.isActiveWebsiteGithubSource"
        :variables="deploymentStore.variables"
      />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();

const { pageLoading, initWebsite } = useHosting();

useHead({
  title: t('dashboard.nav.hosting'),
});

onMounted(async () => {
  initWebsite(DeploymentEnvironment.STAGING, false, true, true);
});
</script>
