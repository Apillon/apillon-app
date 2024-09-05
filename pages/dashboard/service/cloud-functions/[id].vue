<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunctions />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical> </n-space>
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

const usage = ref();

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(async () => {
  await init();
  usage.value = await cloudFunctionStore.fetchUsage(cloudFunctionStore.functionUuid);
});
</script>
