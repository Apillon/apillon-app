<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>
    <slot>
      <template v-if="websiteStore.isActiveWebsiteGithubSource">
        <TableHostingDeploymentVariables :variables="deploymentStore.variables" />
      </template>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();

const { pageLoading, initWebsite } = useHosting();

useHead({
  title: $i18n.t('dashboard.nav.hosting'),
});

onMounted(async () => {
  initWebsite(DeploymentEnvironment.STAGING, false, true, true);
});
</script>
