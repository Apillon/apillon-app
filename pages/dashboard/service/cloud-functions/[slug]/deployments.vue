<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunctions />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <ActionsComputingCloudFunctionJobs />
        <TableComputingCloudFunctionJobs />
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const router = useRouter();
const { params } = useRoute();
const { t } = useI18n();
const dataStore = useDataStore();
const cloudFunctionStore = useCloudFunctionStore();
const { pageLoading, init } = useCloudFunctions();

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(() => {
  init();
});
</script>
