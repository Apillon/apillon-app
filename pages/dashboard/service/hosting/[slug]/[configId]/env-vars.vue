<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>
    <slot>
      <TableHostingDeploymentVariables v-if="params?.configId" :config-id="Number(params?.configId)" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { params } = useRoute();
const { pageLoading, initWebsite } = useHosting();

useHead({
  title: t('dashboard.nav.hosting'),
});

onMounted(async () => {
  initWebsite(DeploymentEnvironment.STAGING);
});
</script>
