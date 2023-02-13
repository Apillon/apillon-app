<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderBucket />
    </template>

    <slot>
      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.webhook') }}</n-h5>

      <FormStorageWebhook class="max-w-xl" :bucket-id="bucketStore.selected" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const bucketStore = useBucketStore();
const { pageLoading, initBucket } = useStorage();

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  initBucket();
});
</script>
