<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>
    <slot>
      <template v-if="!websiteStore.active.repoId">
        <TableHostingDeploymentVariables :variables="deploymentStore.activeVariables" />
      </template>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();
const router = useRouter();
const { params } = useRoute();

const { pageLoading, initWebsite } = useHosting();

useHead({
  title: $i18n.t('dashboard.nav.hosting'),
});

onMounted(async () => {
  initWebsite(DeploymentEnvironment.STAGING, false, true);
});
</script>
