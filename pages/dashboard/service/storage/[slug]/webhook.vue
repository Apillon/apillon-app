<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderStorageBucket />
    </template>

    <slot>
      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.webhook') }}</n-h5>

      <FormStorageWebhook class="max-w-xl" :bucket-uuid="bucketStore.selected" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const bucketStore = useBucketStore();
const { pageLoading, initBucket } = useStorage();

useHead({
  title: t('dashboard.nav.storage'),
});

onMounted(() => {
  initBucket();
});
</script>
