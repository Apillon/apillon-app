<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderBucket />
    </template>

    <slot>
      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.yourFilesAll') }}</n-h5>

      <!-- DataTable: All files in bucket -->
      <TableStorageFilesAll />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const { params } = useRoute();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const pageLoading = ref<boolean>(true);
const bucketId = ref<number>(parseInt(`${params?.slug}`));

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  /** Bucket ID from route, then load buckets */
  bucketStore.onBucketMounted(bucketId.value);

  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    bucketStore.active = await bucketStore.getBucket(bucketId.value);
    pageLoading.value = false;
  });
});
</script>
