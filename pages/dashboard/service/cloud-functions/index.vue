<template>
  <ServiceEmpty
    v-if="!dataStore.project.selected"
    docs="https://wiki.apillon.io/web3-services/8-web3-cloud-functions.html"
    :name="toCamelCase(ServiceTypeName.CLOUD_FUNCTIONS)"
    :service="ServiceTypeName.CLOUD_FUNCTIONS"
  />
  <Dashboard v-else :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunctions />
    </template>
    <slot>
      <n-space v-if="cloudFunctionStore.hasCloudFunctions" class="pb-8" :size="32" vertical>
        <ActionsComputingCloudFunctions />
        <TableComputingCloudFunctions :functions="cloudFunctionStore.items" />
      </n-space>
      <ComputingCloudFunctionsInstructions v-else class="mb-8 pb-8" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const cloudFunctionStore = useCloudFunctionStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await cloudFunctionStore.getCloudFunctions();

  pageLoading.value = false;
});
</script>
