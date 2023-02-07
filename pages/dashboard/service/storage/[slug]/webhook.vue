<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderBucket />
    </template>

    <slot>
      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.webhook') }}</n-h5>

      <FormStorageWebhook class="max-w-xl" :bucket-id="dataStore.bucket.selected" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const { params } = useRoute();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);
const bucketId = ref<number>(parseInt(`${params?.slug}`));

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  /** Bucket ID from route, then load buckets */
  dataStore.onBucketMounted(bucketId.value);

  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    dataStore.bucket.active = await dataStore.getBucket(bucketId.value);
    pageLoading.value = false;
  });
});
</script>
