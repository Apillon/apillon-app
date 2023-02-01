<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <StorageHeading />
    </template>

    <slot>
      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.webhook') }}</n-h5>

      <FormStorageWebhook class="max-w-xl" :bucketId="dataStore.bucket.selected" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const { params } = useRoute();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  /** Bucket ID from route, then load buckets */
  dataStore.onBucketMounted(parseInt(`${params?.slug}`));

  Promise.all(Object.values(dataStore.promises)).then(_ => {
    pageLoading.value = false;
  });
});
</script>
