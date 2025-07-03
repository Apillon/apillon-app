<template>
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
</template>

<script lang="ts" setup>
const bucketStore = useBucketStore();
const deploymentStore = useDeploymentStore();
const { changeEnv } = useHosting();

onMounted(() => {
  changeEnv(DeploymentEnvironment.PRODUCTION);
});
</script>
